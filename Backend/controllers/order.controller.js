import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import CartModel from "../models/cart.model.js";
import mongoose from "mongoose";
import Stripe from "../config/stripe.js";

export async function CashOnDelivery(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const payload = list_items.map((item) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: item.productId._id,
        product_details: {
          name: item.productId.name,
          image: item.productId.image,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });
    const generatedOrder = await OrderModel.insertMany(payload);

    // Update user's orderHistory with the new order IDs
    const orderIds = generatedOrder.map(order => order._id);
    await UserModel.findByIdAndUpdate(
      userId,
      { 
        $push: { orderHistory: { $each: orderIds } },
        shopping_cart: [] 
      }
    );

    const removeCartItems = await CartModel.deleteMany({
      userId: userId,
    });

    return res.json({
      message: "Order successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export const PriceWithDiscount = (price, discount = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(discount)) / 100);
  const actualPrice = Number(price) - discountAmount;
  return actualPrice;
};

export async function paymentController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    if (!list_items || !list_items.length) {
      return res.status(400).json({
        message: "Cart is empty",
        success: false,
        error: true,
      });
    }

    const line_items = list_items.map((items) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: items.productId.name,
            images: items.productId.image,
            metadata: {
              productId: items.productId._id,
            },
          },
          unit_amount: Math.round(
            PriceWithDiscount(items.productId.price, items.productId.discount) * 100
          ),
        },
        quantity: items.quantity,
      };
    });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    };

    console.log("Creating Stripe session with params:", JSON.stringify(params, null, 2));
    
    const session = await Stripe.checkout.sessions.create(params);
    console.log("Stripe session created:", session.id);

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return res.status(500).json({
      message: error.message || "Error creating payment session",
      success: false,
      error: true,
    });
  }
}

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      const payload = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images[0] || '',
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
        quantity: item.quantity,
      };

      productList.push(payload);
    }
  }

  return productList;
};

// http://localhost:8080/api/order/webhook
export async function webhookController(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    // Verify the webhook signature
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Get line items from the session
        const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
        
        // Get user and address from metadata
        const userId = session.metadata.userId;
        const addressId = session.metadata.addressId;
        
        // Create order items using the helper function
        const orderProduct = await getOrderProductItems({
          lineItems: lineItems,
          userId: userId,
          addressId: addressId,
          paymentId: session.payment_intent,
          payment_status: session.payment_status,
        });
        
        // Insert orders
        const order = await OrderModel.insertMany(orderProduct);
        
        // Clear cart and update user's orderHistory if order was created successfully
        if (Boolean(order[0])) {
          // Get order IDs to add to user's orderHistory
          const orderIds = order.map(order => order._id);
          
          // Update user with new orders and clear cart
          await UserModel.findByIdAndUpdate(userId, {
            $push: { orderHistory: { $each: orderIds } },
            shopping_cart: []
          });
          
          await CartModel.deleteMany({ userId: userId });
        }
        
        console.log(`Order created for session ${session.id}`);
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent ${paymentIntent.id} was successful`);
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent ${paymentIntent.id} failed`);
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Error processing webhook' });
  }
}

export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId;

    // First check if the user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Get orders directly from the OrderModel
    const orderlist = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate('delivery_address')
      .populate('productId');

    return res.json({
      message: "order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch order details",
      error: true,
      success: false,
    });
  }
}