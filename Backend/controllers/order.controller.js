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
    
    // Log the request details for debugging
    console.log(`Payment request received for user: ${userId}, items: ${list_items?.length || 0}`);
    
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("Stripe secret key is not configured");
      return res.status(500).json({
        message: "Payment service is not properly configured",
        success: false,
        error: true,
      });
    }
    
    // Check if FRONTEND_URL is configured
    if (!process.env.FRONTEND_URL) {
      console.error("FRONTEND_URL is not configured");
      return res.status(500).json({
        message: "Payment service is not properly configured",
        success: false,
        error: true,
      });
    }
    
    // Log the FRONTEND_URL for debugging
    console.log("Using FRONTEND_URL:", process.env.FRONTEND_URL);
    
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
      // Filter out any invalid image URLs
      const validImages = items.productId.image.filter(url => url && url.trim() !== '');
      
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: items.productId.name,
            images: validImages,
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

    // Ensure FRONTEND_URL doesn't end with a slash
    const frontendUrl = process.env.FRONTEND_URL.endsWith('/') 
      ? process.env.FRONTEND_URL.slice(0, -1) 
      : process.env.FRONTEND_URL;

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
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    };

    console.log("Creating Stripe session with params:", JSON.stringify(params, null, 2));
    
    try {
      const session = await Stripe.checkout.sessions.create(params);
      console.log("Stripe session created:", session.id);

      return res.status(200).json({
        success: true,
        data: session,
      });
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError);
      return res.status(500).json({
        message: stripeError.message || "Error creating payment session",
        success: false,
        error: true,
        stripeError: stripeError.type || 'unknown',
      });
    }
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

  if (!lineItems?.data?.length) {
    console.error("No line items found in the session");
    return productList;
  }

  console.log(`Processing ${lineItems.data.length} line items for order creation`);
  
  try {
    for (const item of lineItems.data) {
      console.log(`Processing line item: ${item.id}, product: ${item.price.product}`);
      
      const product = await Stripe.products.retrieve(item.price.product);
      console.log(`Retrieved product: ${product.name}, metadata:`, product.metadata);
      
      if (!product.metadata.productId) {
        console.error(`Product ${product.id} has no productId in metadata`);
        continue;
      }

      const payload = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images && product.images.length > 0 ? product.images[0] : '',
        },
        paymentId: paymentId || '',
        payment_status: payment_status || 'PAID',
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
        quantity: item.quantity,
      };

      console.log(`Created order payload for product: ${product.name}, amount: ${payload.totalAmt}`);
      productList.push(payload);
    }
  } catch (error) {
    console.error("Error processing line items:", error);
  }

  return productList;
};

// http://localhost:8080/api/order/webhook
export async function webhookController(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  console.log("Webhook received with signature:", sig ? "Present" : "Missing");
  
  if (!endpointSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return res.status(500).json({ error: 'Webhook secret is not configured' });
  }
  
  let event;
  
  try {
    // Verify the webhook signature
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log(`Webhook event received: ${event.type}`);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(`Processing checkout.session.completed for session: ${session.id}`);
        
        // Get line items from the session
        const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
        console.log(`Found ${lineItems.data.length} line items in session`);
        
        // Get user and address from metadata
        const userId = session.metadata.userId;
        const addressId = session.metadata.addressId;
        
        if (!userId || !addressId) {
          console.error(`Missing metadata: userId=${userId}, addressId=${addressId}`);
          return res.status(400).json({ error: 'Missing required metadata' });
        }
        
        console.log(`Creating order for user: ${userId}, address: ${addressId}`);
        
        // Create order items using the helper function
        const orderProduct = await getOrderProductItems({
          lineItems: lineItems,
          userId: userId,
          addressId: addressId,
          paymentId: session.payment_intent,
          payment_status: "PAID", // Set payment status to PAID for online payments
        });
        
        console.log(`Created ${orderProduct.length} order items`);
        
        if (orderProduct.length === 0) {
          console.error("No order items were created");
          return res.status(400).json({ error: 'No order items were created' });
        }
        
        // Insert orders
        const order = await OrderModel.insertMany(orderProduct);
        console.log(`Inserted ${order.length} orders into database`);
        
        // Clear cart and update user's orderHistory if order was created successfully
        if (Boolean(order[0])) {
          // Get order IDs to add to user's orderHistory
          const orderIds = order.map(order => order._id);
          
          // Update user with new orders and clear cart
          const userUpdate = await UserModel.findByIdAndUpdate(
            userId,
            { 
              $push: { orderHistory: { $each: orderIds } },
              shopping_cart: [] 
            },
            { new: true }
          );
          
          if (!userUpdate) {
            console.error(`Failed to update user: ${userId}`);
          } else {
            console.log(`Updated user order history for: ${userId}`);
          }
          
          const cartDelete = await CartModel.deleteMany({ userId: userId });
          console.log(`Deleted ${cartDelete.deletedCount} cart items for user: ${userId}`);
        }
        
        console.log(`Order creation completed for session ${session.id}`);
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

export async function getOrderBySessionController(req, res) {
  try {
    const { sessionId } = req.query;
    console.log(`Fetching order for session: ${sessionId}`);

    if (!sessionId) {
      console.error("No session ID provided");
      return res.status(400).json({
        message: "Session ID is required",
        success: false,
        error: true,
      });
    }

    // Retrieve the session from Stripe
    const session = await Stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
    console.log(`Retrieved Stripe session: ${session.id}`);

    if (!session) {
      console.error(`Session not found: ${sessionId}`);
      return res.status(404).json({
        message: "Session not found",
        success: false,
        error: true,
      });
    }

    // Get the user ID from the session metadata
    const userId = session.metadata.userId;
    if (!userId) {
      console.error("No user ID found in session metadata");
      return res.status(400).json({
        message: "Invalid session data",
        success: false,
        error: true,
      });
    }

    // Find orders for this user that were created after the session completion
    const orders = await OrderModel.find({
      userId: userId,
      createdAt: { $gte: new Date(session.created * 1000) }
    })
    .sort({ createdAt: -1 })
    .populate('delivery_address')
    .populate('productId');

    console.log(`Found ${orders.length} orders for session ${sessionId}`);

    if (!orders.length) {
      console.warn(`No orders found for session ${sessionId}`);
      return res.status(404).json({
        message: "Orders not found",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "Orders retrieved successfully",
      data: orders,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error fetching order by session:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch order details",
      success: false,
      error: true,
    });
  }
}