import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import { addToCart } from "../store/cartSlice";
import toast from "react-hot-toast";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const cartItems = useSelector((state) => state?.cartItem?.cart);

  const fetchCartItems = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.getCartItems,
      });
      const { data: resData } = res;
      if (resData.success) {
        dispatch(addToCart(resData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const updateCartItems = async (cartItemId, quantity) => {
    try {
      const res = await Axios({
        ...SummaryApi.updateCartItem,
        data: { _id: cartItemId, quantity: quantity },
      });
      const { data: resData } = res;
      if (resData.success) {
        toast.success(resData.message);
        fetchCartItems();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const removeCartItems = async (cartItemId) => {
    try {
      const res = await Axios({
        ...SummaryApi.removeCartItem,
        data: { _id: cartItemId },
      });
      const { data: resData } = res;
      if (resData.success) {
        toast.success(resData.message);
        fetchCartItems();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const totalPrice = cartItems.reduce((acc, item) => {
        return acc + (PriceWithDiscount(item.productId?.price, item.productId?.discount) || 0) * (item.quantity || 0);
      }, 0);
      setTotalPrice(totalPrice);

      const totalQuantity = cartItems.reduce((acc, item) => {
        return acc + (item.quantity || 0);
      }, 0);
      setTotalQuantity(totalQuantity);
    } else {
      setTotalPrice(0);
      setTotalQuantity(0);
    }
  }, [cartItems]);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItems,
        updateCartItems,
        removeCartItems,
        totalPrice,
        totalQuantity,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
