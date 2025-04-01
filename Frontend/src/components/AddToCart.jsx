import React, { useEffect, useState } from "react";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa";

const AddToCart = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const { fetchCartItems, updateCartItems, removeCartItems } =
    useGlobalContext();
  const cartItems = useSelector((state) => state?.cartItem?.cart);
  const [isInCartAvailable, setIsInCartAvailable] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartDetails, setCartDetails] = useState();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.addToCart,
        data: {
          productId: data?._id,
        },
      });
      const { data: respData } = res;
      if (respData.success) {
        toast.success(respData.message);
        fetchCartItems();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleQtyDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty === 1) {
      removeCartItems(cartDetails?._id);
    } else {
      updateCartItems(cartDetails?._id, qty - 1);
    }
  };
  const handleQtyIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateCartItems(cartDetails?._id, qty + 1);
  };
  useEffect(() => {
    const checkIsInCart = cartItems.some(
      (item) => item?.productId?._id === data?._id
    );
    setIsInCartAvailable(checkIsInCart);
    const product = cartItems.find(
      (item) => item?.productId?._id === data?._id
    );
    setQty(product?.quantity);
    setCartDetails(product);
  }, [data, cartItems]);
  return (
    <div className="w-full max-w-[150px]">
      {isInCartAvailable ? (
        <div className="flex">
          <button
            onClick={handleQtyDecrement}
            className="bg-green-600 hover:bg-green-700 text-white rounded flex-1 w-full p-1"
          >
            <FaMinus />
          </button>
          <p className="flex-1 w-full px-1 font-semibold">{qty}</p>
          <button
            onClick={handleQtyIncrement}
            className="bg-green-600 hover:bg-green-700 text-white rounded flex-1 w-full p-1"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="border bg-green-600 hover:bg-green-700 text-white px-3 lg:px-4 py-1 rounded"
        >
          {loading ? <Loading /> : "Add"}
        </button>
      )}
    </div>
  );
};

export default AddToCart;
