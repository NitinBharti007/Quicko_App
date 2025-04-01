import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import { addToCart } from "../store/cartSlice";
import toast from "react-hot-toast";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();

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
  return (
    <GlobalContext.Provider
      value={{ fetchCartItems, updateCartItems, removeCartItems }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
