import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import { addToCart } from "../store/cartSlice";
import toast from "react-hot-toast";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [notDiscountedTotalPrice, setNotDiscountedTotalPrice] = useState(0);
  const cartItems = useSelector((state) => state?.cartItem?.cart);
  const user = useSelector((state) => state?.user);

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
        // toast.success(resData.message);
        fetchCartItems();
        return resData;
      }
    } catch (error) {
      AxiosToastError(error);
      return error;
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
    if (cartItems && cartItems.length > 0) {
      const totalPrice = cartItems.reduce((acc, item) => {
        return (
          acc +
          (PriceWithDiscount(item.productId?.price, item.productId?.discount) ||
            0) *
            (item.quantity || 0)
        );
      }, 0);
      setTotalPrice(totalPrice);

      const totalQuantity = cartItems.reduce((acc, item) => {
        return acc + (item.quantity || 0);
      }, 0);
      setTotalQuantity(totalQuantity);

      const notDiscountedTotalPrice = cartItems.reduce((acc, item) => {
        return acc + (item.productId?.price || 0) * (item.quantity || 0);
      }, 0);
      setNotDiscountedTotalPrice(notDiscountedTotalPrice);
    } else {
      setTotalPrice(0);
      setTotalQuantity(0);
      setNotDiscountedTotalPrice(0);
    }
  }, [cartItems]);

  const handleLogOut = () => {
    localStorage.clear();
    dispatch(addToCart([]));
  };

  const fetchAddress = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.getAddress,
      });
      const { data: resData } = res;
      if (resData.success) {
        dispatch(handleAddAddress(resData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartItems();
      fetchAddress();
    }
    handleLogOut();
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItems,
        updateCartItems,
        removeCartItems,
        totalPrice,
        totalQuantity,
        fetchAddress,
        notDiscountedTotalPrice,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
