import React from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRUpees } from "../utils/DisplayPriceInRupees";
import { FaCaretRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CartMobile = () => {
  const { totalPrice, totalQuantity } = useGlobalContext();
  const cartItems = useSelector((state) => state?.cartItem?.cart);
  if (cartItems.length === 0) return null;
  
  return (
    <div className="sticky bottom-4 p-2">
      <div className="bg-green-600 px-2 py-1 lg:hidden rounded text-neutral-100 text-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-green-400 rounded p-2 w-fit">
            <FaCartShopping />
          </div>
          <div className="text-xs">
            <p>{totalQuantity} items</p>
            <p>{DisplayPriceInRUpees(totalPrice)}</p>
          </div>
        </div>
        <Link to={"/cart"} className="flex items-center gap-1">
          <span>View Cart</span>
          <FaCaretRight />
        </Link>
      </div>
    </div>
  );
};

export default CartMobile;
