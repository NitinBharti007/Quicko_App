import React, { useEffect } from 'react';
import { FaTimesCircle, FaHome, FaShoppingBag } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Cancel = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderDetails = useSelector((state) => state?.order?.orderList);

  useEffect(() => {
    if (sessionId) {
      toast.error("Payment was cancelled. You can try again when you're ready.");
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 md:p-10">
            {/* Cancel Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
                <FaTimesCircle className="relative text-red-500 text-6xl sm:text-7xl md:text-8xl" />
              </div>
            </div>

            {/* Cancel Message */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Payment Cancelled
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                Your payment was cancelled. No charges were made to your account.
              </p>
              <p className="text-sm text-gray-500">
                You can return to your cart and try the payment again when you're ready.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300"
              >
                <FaHome className="text-lg" />
                Back to Home
              </Link>
              <Link
                to="/cart"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold rounded-lg transition-colors duration-300"
              >
                <FaShoppingBag className="text-lg" />
                Return to Cart
              </Link>
            </div>

            {/* Support Information */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact our support team at{" "}
                <a href="mailto:support@quicko.vercel.app" className="text-red-600 hover:underline">
                  support@quicko.vercel.app
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
