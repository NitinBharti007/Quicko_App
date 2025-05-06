import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { DisplayPriceInRUpees } from "../utils/DisplayPriceInRupees";
import {
  FaShoppingBag,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShippingFast,
} from "react-icons/fa";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await Axios({
          ...SummaryApi.getOrderDetails,
        });

        if (res.data.success) {
          setOrders(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
        AxiosToastError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to get status icon based on order status
  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return <FaCheckCircle className="text-green-500" />;
      case "SHIPPED":
        return <FaShippingFast className="text-blue-500" />;
      case "PROCESSING":
        return <FaBox className="text-yellow-500" />;
      case "PENDING":
        return <FaClock className="text-yellow-500" />;
      case "CANCELLED":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  // Function to get status text based on order status
  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "Delivered";
      case "SHIPPED":
        return "Shipped";
      case "PROCESSING":
        return "Processing";
      case "PENDING":
        return "Pending";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status || "Unknown";
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            My Orders
          </h1>
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
            <FaShoppingBag className="text-gray-400 text-4xl sm:text-5xl mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-4">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        Order #{order.orderId}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        {getStatusIcon(order.order_status)}
                        <span className="ml-2 text-xs sm:text-sm font-medium">
                          {getStatusText(order.order_status)}
                        </span>
                      </div>
                      
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="w-full md:w-1/4">
                      <img
                        src={
                          order.product_details.image[0] ||
                          "https://via.placeholder.com/150"
                        }
                        alt={order.product_details.name}
                        className="w-full h-auto rounded-md object-cover"
                      />
                    </div>
                    <div className="w-full md:w-3/4">
                      <h4 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                        {order.product_details.name}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Order ID
                          </p>
                          <p className="text-sm sm:text-base font-medium">
                            {order.orderId}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Payment Method
                          </p>
                          <p className="text-sm sm:text-base font-medium">
                            {order.payment_status}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Amount
                          </p>
                          <p className="text-sm sm:text-base font-medium">
                            {DisplayPriceInRUpees(order.totalAmt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Delivery Address
                          </p>
                          <p className="text-sm sm:text-base font-medium line-clamp-2">
                            {order.delivery_address?.address_line ||
                              "Address not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Total Amount
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                      {DisplayPriceInRUpees(order.totalAmt)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/track-order/${order._id}`)
                      }
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
