import React, { useEffect, useState, useRef } from "react";
import { FaCheckCircle, FaHome, FaShoppingBag } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { addToCart } from "../store/cartSlice";
import { setOrder } from "../store/orderSlice";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const Success = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [cartCleared, setCartCleared] = useState(false);
  const [orderProcessed, setOrderProcessed] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state?.cartItem?.cart);
  const { fetchCartItems } = useGlobalContext();
  const sessionId = searchParams.get("session_id");
  const toastShown = useRef(false);

  const clearCart = async () => {
    if (cart?.length > 0 && !cartCleared) {
      try {
        await Axios(SummaryApi.clearCart);
        dispatch(addToCart([]));
        // await fetchCartItems();
        setTimeout(() => {
          fetchCartItems();
        }, 500);
        
        setCartCleared(true);
        return true;
      } catch (error) {
        console.error("Error clearing cart:", error);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const clearCartAndFetchOrder = async () => {
      if (orderProcessed) return;

      try {
        // Clear cart first
        const cartClearedSuccessfully = await clearCart();
        if (!cartClearedSuccessfully) {
          console.error("Failed to clear cart");
          return;
        }

        if (sessionId) {
          try {
            const res = await Axios({
              ...SummaryApi.getOrderBySession,
              params: { sessionId },
            });

            if (res.data.success) {
              if (res.data.processing) {
                if (retryCount < 5) {
                  setRetryCount((prev) => prev + 1);
                  setTimeout(clearCartAndFetchOrder, 2000);
                  return;
                }
                setOrderProcessed(true);
              } else if (res.data.data?.length > 0) {
                dispatch(setOrder(res.data.data));
                if (!toastShown.current) {
                  toast.success("Order placed successfully!");
                  toastShown.current = true;
                }
                setOrderProcessed(true);
              } else {
                setOrderProcessed(true);
              }
            } else {
              setOrderProcessed(true);
            }
          } catch (error) {
            console.error("Error fetching order:", error);
            setOrderProcessed(true);
          }
        } else {
          setOrderProcessed(true);
        }
      } catch (error) {
        console.error("Error in clearCartAndFetchOrder:", error);
        setOrderProcessed(true);
      } finally {
        setLoading(false);
      }
    };

    clearCartAndFetchOrder();
  }, [dispatch, sessionId, retryCount, cart, cartCleared, fetchCartItems, orderProcessed]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
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
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping"></div>
                <FaCheckCircle className="relative text-green-500 text-6xl sm:text-7xl md:text-8xl" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

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
