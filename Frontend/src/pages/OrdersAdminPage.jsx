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
import PageLoading from "../components/PageLoading";

const OrdersAdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

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

  // Handle order status update
  const handleStatusUpdate = async (orderId, status) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: {
          orderId,
          status: status.toUpperCase(),
        },
      });

      if (response.data.success) {
        toast.success("Order status updated successfully");
        // Update the local state to reflect the change
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, order_status: status.toUpperCase() } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Failed to update order status");
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <PageLoading/>
        {/* <p className="text-lg text-gray-600 animate-pulse">Loading orders...</p> */}
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
  return (
    <div className="lg:p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-xl lg:text-2xl font-bold mb-6 text-gray-800">
        Admin Order Management
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-5"
          >
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-3">
              <div>
                <h2 className="text-lg font-semibold text-blue-700">
                  Order #{order.orderId}
                </h2>
                <p className="text-sm text-gray-600">
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
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
              <div className="sm:col-span-2">
                <p className="text-gray-500">Delivery Address</p>
                <p className="font-medium">
                  {order.delivery_address?.address_line ||
                    "Address not available"}
                </p>
              </div>
            </div>

            {/* Status Update */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Order Status:
              </label>
              <select
                value={order.order_status}
                disabled={updatingId === order._id}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full sm:w-auto focus:outline-none"
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
