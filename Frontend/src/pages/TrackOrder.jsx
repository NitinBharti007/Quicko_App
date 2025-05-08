import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTruck, FaBox, FaCheckCircle, FaShippingFast, FaTimesCircle } from 'react-icons/fa';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define tracking steps based on order status
  const trackingSteps = [
    { id: 'PENDING', label: 'Order Placed', icon: FaBox },
    { id: 'PROCESSING', label: 'Processing', icon: FaBox },
    { id: 'SHIPPED', label: 'Shipped', icon: FaShippingFast },
    { id: 'DELIVERED', label: 'Delivered', icon: FaCheckCircle },
    { id: 'CANCELLED', label: 'Cancelled', icon: FaTimesCircle },
  ];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await Axios({
          ...SummaryApi.getOrderDetails,
        });
        
        if (res.data.success) {
          const orderDetails = res.data.data.find(order => order._id === orderId);
          if (orderDetails) {
            setOrder(orderDetails);
          } else {
            setError('Order not found');
          }
        } else {
          setError(res.data.message || 'Failed to fetch order details');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        if (error.response?.status === 401) {
          setError('Please login to view order details');
        } else if (error.response?.status === 404) {
          setError('Order not found');
        } else {
          setError('Failed to fetch order details. Please try again later.');
        }
        AxiosToastError(error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <FaBox className="text-red-500 text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Error Loading Order</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/dashboard/orders')} 
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Order Tracking</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Order #{order?.orderId}</p>
              </div>
              <button 
                onClick={() => navigate('/dashboard/orders')}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 text-blue-500 hover:text-blue-600 border border-blue-500 rounded-md hover:bg-blue-50 transition-colors text-sm sm:text-base"
              >
                Back to Orders
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Tracking Status</h2>
              <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
                <div className="relative flex justify-between">
                  {trackingSteps.map((step, index) => {
                    const isActive = trackingSteps.findIndex(s => s.id === order?.order_status) >= index;
                    const isCancelled = order?.order_status === 'CANCELLED';
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div className={`lg:w-10 lg:h-10 w-8 h-8 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                          isCancelled && step.id === 'CANCELLED' 
                            ? 'bg-red-500 text-white'
                            : isActive 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Icon className="lg:w-5 lg:h-5 w-4 h-4" />
                        </div>
                        <span className={`lg:text-sm hidden lg:block text-xs font-normal text-center ${
                          isCancelled && step.id === 'CANCELLED'
                            ? 'text-red-500'
                            : isActive 
                              ? 'text-blue-500' 
                              : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Order Details</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Order Date</p>
                    <p className="text-sm sm:text-base font-medium">{new Date(order?.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Payment Status</p>
                    <p className="text-sm sm:text-base font-medium">{order?.payment_status}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Order Status</p>
                    <p className="text-sm sm:text-base font-medium">{order?.order_status}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Total Amount</p>
                    <p className="text-sm sm:text-base font-medium">₹{order?.totalAmt}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Delivery Address</h3>
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-sm sm:text-base font-medium">{order?.delivery_address?.address_line}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{order?.delivery_address?.city}, {order?.delivery_address?.state}</p>
                  <p className="text-xs sm:text-sm text-gray-600">PIN: {order?.delivery_address?.pincode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder; 