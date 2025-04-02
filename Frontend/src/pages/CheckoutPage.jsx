import React, { useState } from "react";
import { DisplayPriceInRUpees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddressBox from "../components/AddAddressBox";

const CheckoutPage = () => {
  const { totalPrice, notDiscountedTotalPrice, totalQuantity } =
    useGlobalContext();
  const [openAddAdress, setOpenAddAddress] = useState(false);
  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-5 justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-1">Choose your address</h3>
          <div
            onClick={() => setOpenAddAddress(true)}
            className="h-16 bg-blue-50 border-2 border-dotted flex justify-center items-center"
          >
            Add address
          </div>
        </div>

        <div className="w-full max-w-md bg-white px-2 py-3">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="bg-white p-3">
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
          <div className="w-full flex flex-col gap-4">
            <button className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded">
              Online Payment
            </button>
            <button className="py-2 px-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold rounded">
              Cash On Delivery
            </button>
          </div>
        </div>
        {openAddAdress && (
          <AddAddressBox close={() => setOpenAddAddress(false)} />
        )}
      </div>
    </section>
  );
};

export default CheckoutPage;
