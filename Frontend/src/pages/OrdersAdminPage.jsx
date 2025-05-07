import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { DisplayPriceInRUpees } from "../utils/DisplayPriceInRupees";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaShippingFast,
} from "react-icons/fa";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useSocket } from "../context/SocketContext";
import { useSelector } from "react-redux";

const OrdersAdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const user = useSelector((state) => state.user);

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await Axios(SummaryApi.getAllOrdersForAdmin);
      if (res.data.success) {
        setOrders(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error(error);
      AxiosToastError(error);
      setError("Something went wrong while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket || !isConnected || user?.role !== 'ADMIN') return;

    // Join admin room
    socket.emit('joinAdminRoom');

    // Listen for new orders
    socket.on('newOrder', (data) => {
      setOrders(prevOrders => [...data.orders, ...prevOrders]);
      toast.success(data.message || 'New orders received!');
    });

    // Listen for order status updates
    socket.on('orderStatusUpdate', (data) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === data.orderId
            ? { 
                ...order, 
                order_status: data.status,
                payment_status: data.payment_status || order.payment_status
              }
            : order
        )
      );
      toast.success(data.message || 'Order status updated!');
    });

    return () => {
      if (socket) {
        socket.off('newOrder');
        socket.off('orderStatusUpdate');
      }
    };
  }, [socket, isConnected, user?.role]);

  // Handle order status update
  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: {
          orderId,
          status: status.toUpperCase(),
        },
      });

      // if (response.data.success) {
      //   // The socket event will handle the UI update
      //   toast.success("Order status updated successfully");
      // }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Icon based on order status
  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return <FaCheckCircle className="text-green-600" />;
      case "SHIPPED":
        return <FaShippingFast className="text-blue-500" />;
      case "PENDING":
        return <FaClock className="text-yellow-500" />;
      case "CANCELLED":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  // UI while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading all orders...</p>
        </div>
      </div>
    );
  }

  // UI if error
  if (error) {
    return (
      <div className="text-center text-red-600 p-10 font-semibold">
        Error: {error}
      </div>
    );
  }

  // Render component
  // return (
  //   <div className="lg:p-4 md:p-8 bg-gray-50 min-h-screen">
  //     <h1 className="text-xl lg:text-2xl font-bold mb-6 text-gray-800">
  //       Admin Order Management
  //     </h1>

  //     {orders.length === 0 ? (
  //       <p className="text-center text-gray-500">No orders found.</p>
  //     ) : (
  //       orders.map((order) => (
  //         <div
  //           key={order._id}
  //           className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-5"
  //         >
  //           {/* Header */}
  //           <div className="flex flex-wrap justify-between items-center mb-3">
  //             <div>
  //               <h2 className="text-lg font-semibold text-blue-700">
  //                 Order #{order.orderId}
  //               </h2>
  //               <p className="text-sm text-gray-600">
  //                 {order.userId?.name || "Unknown User"} -{" "}
  //                 {order.userId?.email || "N/A"}
  //               </p>
  //             </div>
  //             <div className="flex items-center gap-2 text-sm font-medium">
  //               {getStatusIcon(order.order_status)}
  //               <span className="capitalize">
  //                 {order.order_status?.toLowerCase()}
  //               </span>
  //             </div>
  //           </div>

  //           {/* Info Grid */}
  //           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
  //             <div>
  //               <p className="text-gray-500">Total Amount</p>
  //               <p className="font-medium">
  //                 {DisplayPriceInRUpees(order.totalAmt)}
  //               </p>
  //             </div>
  //             <div>
  //               <p className="text-gray-500">Payment Status</p>
  //               <p className="font-medium capitalize">{order.payment_status}</p>
  //             </div>
  //             <div>
  //               <p className="text-gray-500">Product</p>
  //               <p className="font-medium truncate">
  //                 {order.product_details?.name || "Product Removed"}
  //               </p>
  //             </div>
  //             <div>
  //               <p className="text-gray-500">Order Date & Time</p>
  //               <p className="font-medium truncate">
  //                 {new Date(order.createdAt).toLocaleString("en-IN", {
  //                   dateStyle: "medium",
  //                   timeStyle: "short",
  //                 })}
  //               </p>
  //             </div>
  //             <div className="sm:col-span-2">
  //               <p className="text-gray-500">Delivery Address</p>
  //               <p className="font-medium">
  //                 {order.delivery_address?.address_line ||
  //                   "Address not available"}
  //               </p>
  //             </div>
              
  //           </div>

  //           {/* Status Update */}
  //           <div className="mt-4">
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Update Order Status:
  //             </label>
  //             <select
  //               value={order.order_status}
  //               disabled={updatingId === order._id}
  //               onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
  //               className="border cursor-pointer border-gray-300 rounded px-3 py-2 w-full sm:w-auto focus:outline-none"
  //             >
  //               <option value="PENDING">Pending</option>
  //               <option value="PROCESSING">Processing</option>
  //               <option value="SHIPPED">Shipped</option>
  //               <option value="DELIVERED">Delivered</option>
  //               <option value="CANCELLED">Cancelled</option>
  //             </select>
  //             {updatingId === order._id && (
  //               <p className="text-sm text-blue-500 mt-1">Updating...</p>
  //             )}
  //           </div>
  //         </div>
  //       ))
  //     )}
  //   </div>
  // );
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 text-gray-800">
        Admin Order Management
      </h1>
  
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-5 mb-6 overflow-x-auto"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-blue-700 break-words">
                  Order #{order.orderId}
                </h2>
                <p className="text-sm text-gray-600 break-words">
                  {order.userId?.name || "Unknown User"} -{" "}
                  {order.userId?.email || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                {getStatusIcon(order.order_status)}
                <span className="capitalize">
                  {order.order_status?.toLowerCase()}
                </span>
              </div>
            </div>
  
            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Amount</p>
                <p className="font-medium">
                  {DisplayPriceInRUpees(order.totalAmt)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Payment Status</p>
                <p className="font-medium capitalize">
                  {order.payment_status}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Product</p>
                <p className="font-medium truncate">
                  {order.product_details?.name || "Product Removed"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Order Date & Time</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">Delivery Address</p>
                <p className="font-medium break-words">
                  {order.delivery_address?.address_line ||
                    "Address not available"}
                </p>
              </div>
            </div>
  
            {/* Status Update */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Order Status:
              </label>
              <select
                value={order.order_status}
                disabled={updatingId === order._id}
                onChange={(e) =>
                  handleStatusUpdate(order._id, e.target.value)
                }
                className="border cursor-pointer border-gray-300 rounded px-3 py-2 w-full sm:w-auto focus:outline-none"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              {updatingId === order._id && (
                <p className="text-sm text-blue-500 mt-1">Updating...</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
  
};

export default OrdersAdminPage;
