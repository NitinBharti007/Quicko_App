import React, { useState } from "react";
import { DisplayPriceInRUpees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddressBox from "../components/AddAddressBox";
import { useSelector } from "react-redux";
import { FaPlus, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const CheckoutPage = () => {
  const { totalPrice, notDiscountedTotalPrice, totalQuantity } =
    useGlobalContext();
  const [openAddAdress, setOpenAddAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const addressList = useSelector((state) => state.address.addressList);
  console.log(addressList[selectedAddress]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* Address Section */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                Choose your address
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {addressList.map((address, index) => {
                  return (
                    <label
                      key={index}
                      htmlFor={"address" + index}
                      className={`block cursor-pointer border rounded-lg p-3 sm:p-4 transition-all duration-200 ${
                        selectedAddress == index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-blue-50"
                      } ${!address.status && "hidden"}`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <input
                          id={"address" + index}
                          type="radio"
                          value={index}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          name="address"
                          className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex flex-col gap-1 sm:gap-2">
                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                              {address.address_line}
                            </p>
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                              <FaMapMarkerAlt className="text-gray-400 text-sm" />
                              {address.city}, {address.state}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {address.country} - {address.pincode}
                            </p>
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                              <FaPhoneAlt className="text-gray-400 text-sm" />
                              {address.mobile}
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}

                <button
                  onClick={() => setOpenAddAddress(true)}
                  className="w-full h-14 sm:h-16 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center gap-2 text-blue-600 hover:border-blue-400 hover:bg-blue-100 transition-colors duration-200"
                >
                  <FaPlus className="text-sm sm:text-base" />
                  <span className="font-medium text-sm sm:text-base">
                    Add address
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 sticky top-4 sm:top-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                Summary
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-gray-800">Bill Details</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Total Price
                  </p>
                  <p className="flex gap-2 items-center">
                    <span className="line-through text-gray-400 text-xs sm:text-sm">
                      {DisplayPriceInRUpees(notDiscountedTotalPrice)}
                    </span>
                    <span className="font-medium text-sm sm:text-base">
                      {DisplayPriceInRUpees(totalPrice)}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Total Quantity
                  </p>
                  <p className="text-sm sm:text-base">{totalQuantity} items</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Delivery Charges
                  </p>
                  <p className="text-green-600 text-sm sm:text-base">Free</p>
                </div>
                <div className="border-t pt-3 sm:pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">
                      Grand Total
                    </p>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">
                      {DisplayPriceInRUpees(totalPrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                <button className="w-full py-2 sm:py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base">
                  Online Payment
                </button>
                <button className="w-full py-2 sm:py-3 px-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base">
                  Cash On Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openAddAdress && (
        <AddAddressBox close={() => setOpenAddAddress(false)} />
      )}
    </section>
  );
};

export default CheckoutPage;
