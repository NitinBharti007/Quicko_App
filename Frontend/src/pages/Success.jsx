import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaHome, FaShoppingBag } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { addToCart } from "../store/cartSlice";
import { setOrder } from "../store/orderSlice";
import toast from "react-hot-toast";

const Success = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [cartCleared, setCartCleared] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const clearCartAndFetchOrder = async () => {
      try {
        console.log("Processing successful payment with session ID:", sessionId);
        
        // Only clear the cart if it's not already empty and hasn't been cleared
        if (cart?.length > 0 && !cartCleared) {
          console.log("Clearing cart...");
          await Axios({
            ...SummaryApi.clearCart,
          });
          dispatch(addToCart([]));
          setCartCleared(true);
          console.log("Cart cleared successfully");
        } else {
          console.log("Cart is already empty or has been cleared");
        }

        // Fetch order details if session ID exists
        if (sessionId) {
          console.log("Fetching order details for session:", sessionId);
          try {
            const res = await Axios({
              ...SummaryApi.getOrderBySession,
              params: { sessionId },
            });
            
            console.log("Order details response:", res.data);
            
            if (res.data.success) {
              if (res.data.processing) {
                // If order is still processing, retry after a delay
                if (retryCount < 5) {
                  console.log(`Order still processing, retry ${retryCount + 1}/5`);
                  setRetryCount(prev => prev + 1);
                  setTimeout(clearCartAndFetchOrder, 2000); // Retry after 2 seconds
                  return;
                } else {
                  console.warn("Max retries reached, order still processing");
                  toast.error("Order is taking longer than expected. Please check your orders page in a few minutes.");
                }
              } else if (res.data.data && res.data.data.length > 0) {
                dispatch(setOrder(res.data.data));
                toast.success("Order placed successfully!");
                console.log("Order details fetched and stored in Redux");
              } else {
                console.error("No order data returned");
                toast.error("Order placed but details could not be retrieved. Please check your orders page.");
              }
            } else {
              console.error("Failed to fetch order details:", res.data.message);
              toast.error("Order placed but details could not be retrieved. Please check your orders page.");
            }
          } catch (orderError) {
            console.error("Error fetching order details:", orderError);
            toast.error("Order placed but details could not be retrieved. Please check your orders page.");
          }
        } else {
          console.warn("No session ID found in URL");
          toast.error("Order information not found. Please check your orders page.");
        }
      } catch (error) {
        console.error("Error processing successful payment:", error);
        toast.error("Something went wrong. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    clearCartAndFetchOrder();
  }, [dispatch, sessionId, retryCount, cart, cartCleared]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 md:p-10">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping"></div>
                <FaCheckCircle className="relative text-green-500 text-6xl sm:text-7xl md:text-8xl" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300"
              >
                <FaHome className="text-lg" />
                Back to Home
              </Link>
              <Link
                to="/dashboard/orders"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold rounded-lg transition-colors duration-300"
              >
                <FaShoppingBag className="text-lg" />
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;