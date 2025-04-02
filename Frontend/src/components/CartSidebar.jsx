import React from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRUpees } from "../utils/DisplayPriceInRupees";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddToCart from "./AddToCart";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";
import NoItems from "../assets/EmptyCart.jpg";
import toast from "react-hot-toast";

const CartSidebar = ({ close }) => {
  const { totalPrice, notDiscountedTotalPrice, totalQuantity } =
    useGlobalContext();
  const cartItems = useSelector((state) => state?.cartItem?.cart);
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const redirectToCheckoutPage = () => {
    if (user) {
      navigate("/checkout");
      if (close) {
        close();
      }
      return;
    } else {
    }
    toast("Please login");
  };
  return (
    <section className="fixed bg-neutral-900 top-0 right-0 left-0 bottom-0 bg-opacity-50 z-50 h-full">
      <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto">
        <div className="flex justify-between items-center shadow-md gap-3 p-4">
          <h2 className="text-lg font-semibold">Cart</h2>
          <Link to={"/"} className="lg:hidden">
            <IoClose size={25} />
          </Link>
          <button onClick={close} className="hidden lg:block">
            <IoClose size={25} />
          </button>
        </div>

        <div className="min-h-[77vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-130px)] bg-blue-50 p-2 flex flex-col gap-4">
          {/* DisplayItem  */}
          {cartItems[0] ? (
            <>
              <div className="flex justify-between items-center px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
                <p>Your total savings :</p>
                <p>
                  {DisplayPriceInRUpees(notDiscountedTotalPrice - totalPrice)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-2 grid gap-5 overflow-auto">
                {cartItems[0] &&
                  cartItems.map((item, index) => {
                    return (
                      <div key={index} className="flex w-full gap-4">
                        <div className="w-16 h-16 min-h-16 min-w-16 bg-red-500 border rounded">
                          <img
                            src={item?.productId?.image[0]}
                            alt=""
                            className="object-scale-down"
                          />
                        </div>
                        <div className="w-full max-w-sm text-xs">
                          <p className="text-xs text-ellipsis line-clamp-2">
                            {item.productId?.name}
                          </p>
                          <p className="text-neutral-400">
                            {item.productId?.unit}
                          </p>
                          <p className="text-neutral-600 font-semibold">
                            {DisplayPriceInRUpees(
                              PriceWithDiscount(
                                item.productId?.price,
                                item.productId?.discount
                              )
                            )}
                          </p>
                        </div>
                        <div>
                          <AddToCart data={item?.productId} />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="bg-white p-2">
                <h3 className="font-semibold">Bill Details</h3>
                <div className="flex justify-between items-center gap-4 ml-1">
                  <p>Total Price :</p>
                  <p className="flex gap-2 items-center">
                    <span className="line-through text-neutral-400">
                      {DisplayPriceInRUpees(notDiscountedTotalPrice)}
                    </span>
                    <span>{DisplayPriceInRUpees(totalPrice)}</span>
                  </p>
                </div>
                <div className="flex justify-between items-center gap-4 ml-1">
                  <p>Total Quantity :</p>
                  <p className="text-sm flex gap-2 items-center">
                    {totalQuantity} items
                  </p>
                </div>
                <div className="flex justify-between items-center gap-4 ml-1">
                  <p>Delivery Charges :</p>
                  <p className="text-sm flex gap-2 items-center">Free</p>
                </div>
                <div className="flex justify-between items-center font-semibold gap-4">
                  <p>Grand Total :</p>
                  <p className="text-sm flex gap-2 items-center">
                    {DisplayPriceInRUpees(totalPrice)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center bg-white h-full gap-6 p-2">
              <div>
                <img
                  src={NoItems}
                  alt=""
                  className="w-full h-full object-scale-down"
                />
              </div>
              <div className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                <Link onClick={close} to={"/"}>
                  Shop Now
                </Link>
              </div>
            </div>
          )}
        </div>

        {cartItems[0] && (
          <div className="p-2">
            <div className="bg-green-700 p-4 rounded text-neutral-100 font-bold text-base sticky bottom-3 flex justify-between items-center">
              <div>{DisplayPriceInRUpees(totalPrice)}</div>
              <button
                onClick={redirectToCheckoutPage}
                className="flex items-center gap-1"
              >
                Checkout
                <span>
                  <FaCaretRight />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartSidebar;
