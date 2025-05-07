import OrderModel from "../models/order.model.js";
import AddressModel from "../models/address.model.js";

// Get all orders for admin
export async function getAllOrdersForAdmin(req, res) {
  try {
    const orders = await OrderModel.find()
      .populate("productId")
      .populate("userId")
      .populate("delivery_address")
      .sort({ createdAt: -1 });

    return res.json({
      message: "Orders retrieved successfully",
      data: orders,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch orders",
      success: false,
      error: true,
    });
  }
}

// Update order status
export async function updateOrderStatus(req, res) {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        message: "Order ID and status are required",
        success: false,
        error: true,
      });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { order_status: status },
      { new: true }
    ).populate("userId").populate("delivery_address");

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }

    // Get the io instance from the app
    const io = req.app.get('io');
    
    // Emit the order update event to all connected clients
    io.emit('orderStatusUpdate', {
      orderId: updatedOrder._id,
      status: updatedOrder.order_status,
      order: updatedOrder
    });

    return res.json({
      message: "Order status updated successfully",
      data: updatedOrder,
      success: true,
      error: false,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update order status",
      success: false,
      error: true,
    });
  }
}

// Get all addresses for admin
export async function getAllAddressesForAdmin(req, res) {
  try {
    const addresses = await AddressModel.find().populate("userId", "name email").sort({ createdAt: -1 });
    return res.json({
      message: "Addresses retrieved successfully",
      data: addresses,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch addresses",
      success: false,
      error: true,
    });
  }
}
