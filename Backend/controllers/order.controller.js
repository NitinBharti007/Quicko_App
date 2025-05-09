import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import CartModel from "../models/cart.model.js";
import mongoose from "mongoose";
import Stripe from "../config/stripe.js";

export const PriceWithDiscount = (price, discount = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(discount)) / 100);
  return Number(price) - discountAmount;
};

// Create order for cash on delivery
export async function CashOnDelivery(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const payload = list_items.map((item) => ({
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: item.productId._id,
      product_details: {
        name: item.productId.name,
        image: item.productId.image,
      },
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: addressId,
      subTotalAmt,
      totalAmt,
    }));

    const generatedOrder = await OrderModel.insertMany(payload);
    const orderIds = generatedOrder.map((order) => order._id);

    await UserModel.findByIdAndUpdate(userId, {
      $push: { orderHistory: { $each: orderIds } },
      shopping_cart: [],
    });

    await CartModel.deleteMany({ userId });

    // Get the io instance from the app
    const io = req.app.get("io");

    // Emit the new order event to all connected clients
    io.emit("newOrder", {
      orders: generatedOrder,
      userId: userId,
    });

    return res.json({
      message: "Order successful",
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

// Create Stripe payment session
export async function paymentController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    if (!process.env.STRIPE_SECRET_KEY || !process.env.FRONTEND_URL) {
      return res.status(500).json({
        message: "Payment service is not properly configured",
        success: false,
        error: true,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    if (!list_items?.length) {
      return res.status(400).json({
        message: "Cart is empty",
        success: false,
        error: true,
      });
    }

    const line_items = list_items.map((items) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: items.productId.name,
          images: items.productId.image.filter(
            (url) => url && url.trim() !== ""
          ),
          metadata: { productId: items.productId._id },
        },
        unit_amount: Math.round(
          PriceWithDiscount(items.productId.price, items.productId.discount) *
            100
        ),
      },
      quantity: items.quantity,
    }));

    const frontendUrl = process.env.FRONTEND_URL.endsWith("/")
      ? process.env.FRONTEND_URL.slice(0, -1)
      : process.env.FRONTEND_URL;

    const session = await Stripe.checkout.sessions.create({
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: { userId, addressId },
      line_items,
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error creating payment session",
      success: false,
      error: true,
    });
  }
}

// Helper function to create order items from Stripe line items
const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  if (!lineItems?.data?.length) return [];

  try {
    const productList = await Promise.all(
      lineItems.data.map(async (item) => {
        const product = await Stripe.products.retrieve(item.price.product);
        if (!product.metadata.productId) return null;

        return {
          userId,
          orderId: `ORD-${new mongoose.Types.ObjectId()}`,
          productId: product.metadata.productId,
          product_details: {
            name: product.name,
            image: product.images?.[0] || "",
          },
          paymentId: paymentId || "",
          payment_status: payment_status || "PAID",
          delivery_address: addressId,
          subTotalAmt: Number(item.amount_total / 100),
          totalAmt: Number(item.amount_total / 100),
          quantity: item.quantity,
        };
      })
    );

    return productList.filter(Boolean);
  } catch (error) {
    console.error("Error processing line items:", error);
    return [];
  }
};

// Handle Stripe webhooks
// export async function webhookController(req, res) {
//   const sig = req.headers["stripe-signature"];
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   if (!endpointSecret) {
//     return res.status(500).json({ error: "Webhook secret is not configured" });
//   }

//   let event;
//   try {
//     event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   try {
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const { userId, addressId } = session.metadata;

//       if (!userId || !addressId) {
//         return res.status(400).json({ error: "Missing required metadata" });
//       }

//       // Get user information
//       const user = await UserModel.findById(userId);
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       const lineItems = await Stripe.checkout.sessions.listLineItems(
//         session.id
//       );
//       const orderProduct = await getOrderProductItems({
//         lineItems,
//         userId,
//         addressId,
//         paymentId: session.payment_intent,
//         payment_status: "PAID",
//       });

//       if (orderProduct.length === 0) {
//         return res.status(400).json({ error: "No order items were created" });
//       }

//       // Set initial order status to PROCESSING for online payments
//       const ordersWithStatus = orderProduct.map((order) => ({
//         ...order,
//         order_status: "PROCESSING",
//       }));

//       const orders = await OrderModel.insertMany(ordersWithStatus);
      
//       if (orders.length > 0) {
//         const orderIds = orders.map((order) => order._id);
//         await UserModel.findByIdAndUpdate(userId, {
//           $push: { orderHistory: { $each: orderIds } },
//           shopping_cart: [],
//         });
//         await CartModel.deleteMany({ userId });

//         // Get io instance
//         const io = req.app.get("io");

//         // Emit new order event to admin with user information
//         io.to("admin").emit("newOrder", {
//           orders: orders.map((order) => ({
//             ...order.toObject(),
//             user: {
//               name: user.name,
//               email: user.email,
//             },
//           })),
//           message: "New orders received",
//         });

//         // Emit new order event to user
//         io.to(`user_${userId}`).emit("newOrder", {
//           orders: orders,
//           userId: userId,
//           message: "Your orders have been placed successfully",
//         });

//         // Emit status updates for each order
//         orders.forEach((order) => {
//           // Emit to admin room
//           io.to("admin").emit("orderStatusUpdate", {
//             orderId: order._id,
//             status: "PROCESSING",
//             payment_status: "PAID",
//             message: "Payment completed and order processing",
//           });

//           // Emit to user's room
//           io.to(`user_${userId}`).emit("orderStatusUpdate", {
//             orderId: order._id,
//             status: "PROCESSING",
//             payment_status: "PAID",
//             message: "Payment completed and order processing",
//           });
//         });
//       }
//     }

//     res.json({ received: true });
//   } catch (error) {
//     console.error("Webhook Processing Error:", error);
//     res.status(500).json({ error: "Error processing webhook" });
//   }
// }

export async function webhookController(req, res) {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    return res.status(500).json({ error: "Webhook secret is not configured" });
  }

  let event;
  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { userId, addressId } = session.metadata;

      if (!userId || !addressId) {
        return res.status(400).json({ error: "Missing required metadata" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
      const orderProduct = await getOrderProductItems({
        lineItems,
        userId,
        addressId,
        paymentId: session.payment_intent,
        payment_status: "PAID",
      });

      if (orderProduct.length === 0) {
        return res.status(400).json({ error: "No order items were created" });
      }

      const ordersWithStatus = orderProduct.map((order) => ({
        ...order,
        order_status: "PROCESSING",
      }));

      // Insert orders
      const insertedOrders = await OrderModel.insertMany(ordersWithStatus);

      // Populate inserted orders with user, address, and product info
      const populatedOrders = await OrderModel.find({
        _id: { $in: insertedOrders.map((o) => o._id) },
      })
        .populate("userId", "name email")
        .populate("delivery_address")
        .populate("productId");

      // Update user order history and clear cart
      const orderIds = insertedOrders.map((o) => o._id);
      await UserModel.findByIdAndUpdate(userId, {
        $push: { orderHistory: { $each: orderIds } },
        shopping_cart: [],
      });
      await CartModel.deleteMany({ userId });

      const io = req.app.get("io");

      // Emit newOrder to admin
      io.to("admin").emit("newOrder", {
        orders: populatedOrders,
        message: "New orders received",
      });

      // Emit to user
      io.to(`user_${userId}`).emit("newOrder", {
        orders: populatedOrders,
        userId,
        message: "Your orders have been placed successfully",
      });

      // Emit orderStatusUpdate for each order
      populatedOrders.forEach((order) => {
        io.to("admin").emit("orderStatusUpdate", {
          orderId: order._id,
          status: order.order_status,
          payment_status: order.payment_status,
          order,
        });

        io.to(`user_${userId}`).emit("orderStatusUpdate", {
          orderId: order._id,
          status: order.order_status,
          payment_status: order.payment_status,
          order,
        });
      });
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook Processing Error:", error);
    res.status(500).json({ error: "Error processing webhook" });
  }
}


// Get order details for a user
export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const orderlist = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .populate("productId");

    return res.json({
      message: "Order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch order details",
      error: true,
      success: false,
    });
  }
}

// Get order by Stripe session ID
export async function getOrderBySessionController(req, res) {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({
        message: "Session ID is required",
        success: false,
        error: true,
      });
    }

    const session = await Stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (!session || !session.metadata.userId) {
      return res.status(404).json({
        message: "Session not found or invalid",
        success: false,
        error: true,
      });
    }

    const { userId } = session.metadata;
    let orders = await OrderModel.find({
      userId,
      createdAt: { $gte: new Date(session.created * 1000) },
    })
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .populate("productId");

    if (!orders.length && session.payment_status === "paid") {
      const lineItems = await Stripe.checkout.sessions.listLineItems(
        session.id
      );
      const orderProduct = await getOrderProductItems({
        lineItems,
        userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: "PAID",
      });

      if (orderProduct.length > 0) {
        const newOrders = await OrderModel.insertMany(orderProduct);
        const orderIds = newOrders.map((order) => order._id);

        await UserModel.findByIdAndUpdate(userId, {
          $push: { orderHistory: { $each: orderIds } },
          shopping_cart: [],
        });

        await CartModel.deleteMany({ userId });

        // Get io instance
        const io = req.app.get("io");

        // Emit new order event to admin
        io.to("admin").emit("newOrder", {
          orders: newOrders,
          message: "New orders received",
        });

        // Emit new order event to user
        io.to(`user_${userId}`).emit("newOrder", {
          orders: newOrders,
          userId: userId,
          message: "Your orders have been placed successfully",
        });

        // Emit status updates for each order
        newOrders.forEach((order) => {
          // Emit to admin room
          io.to("admin").emit("orderStatusUpdate", {
            orderId: order._id,
            status: "PROCESSING",
            payment_status: "PAID",
            message: "Payment completed and order processing",
          });

          // Emit to user's room
          io.to(`user_${userId}`).emit("orderStatusUpdate", {
            orderId: order._id,
            status: "PROCESSING",
            payment_status: "PAID",
            message: "Payment completed and order processing",
          });
        });

        orders = await OrderModel.find({
          _id: { $in: orderIds },
        })
          .sort({ createdAt: -1 })
          .populate("delivery_address")
          .populate("productId");
      }
    }

    if (!orders.length) {
      return res.json({
        message:
          session.payment_status === "paid"
            ? "Payment successful, order processing"
            : "Orders not found",
        data: [],
        success: true,
        error: false,
        processing: session.payment_status === "paid",
      });
    }

    return res.json({
      message: "Orders retrieved successfully",
      data: orders,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Get Order By Session Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch order details",
      success: false,
      error: true,
    });
  }
}
