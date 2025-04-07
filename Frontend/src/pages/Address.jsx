import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddressBox from "../components/AddAddressBox";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import EditAddressBox from "../components/EditAddressBox";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const addressList = useSelector((state) => state.address.addressList);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [editData, setEditData] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async (_id) => {
    try {
      const res = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id },
      });
      const { data: resData } = res;
      if (resData.success) {
        toast.success(resData.message);
        if (fetchAddress) {
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Check if there are no addresses or if all addresses are disabled
  const noAddressesFound = addressList.length === 0 || 
    (addressList.length > 0 && addressList.every((address) => !address.status));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" />
                Saved Addresses
              </h3>
              <button
                onClick={() => setOpenAddAddress(true)}
                className="w-full sm:w-auto px-4 py-2 bg-primary-200 hover:bg-primary-100 text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <MdModeEdit className="text-lg" />
                Add Address
              </button>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {!noAddressesFound ? (
                addressList.map((address, index) => (
                  <div
                    key={index}
                    className={`border border-gray-200 rounded-lg p-4 sm:p-5 hover:border-blue-300 hover:shadow-sm transition-all duration-300 ${
                      !address.status && "hidden"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col gap-2">
                          <p className="font-semibold text-gray-800 text-base sm:text-lg">
                            {address.address_line}
                          </p>
                          <div className="flex flex-col gap-1">
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                              <FaMapMarkerAlt className="text-gray-400" />
                              {address.city}, {address.state}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {address.country} - {address.pincode}
                            </p>
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                              <FaPhoneAlt className="text-gray-400" />
                              {address.mobile}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-4 sm:gap-6">
                        <button
                          onClick={() => {
                            setOpenEdit(true);
                            setEditData(address);
                          }}
                          className="p-2 bg-green-200 hover:bg-green-600 hover:text-white rounded-lg transition-colors duration-300"
                        >
                          <MdModeEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDisableAddress(address._id)}
                          className="p-2 bg-red-200 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-300"
                        >
                          <MdDelete className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaMapMarkerAlt className="mx-auto text-gray-400 text-4xl mb-4" />
                  <p className="text-gray-600 text-lg">
                    No saved addresses found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {openAddAddress && (
        <AddAddressBox close={() => setOpenAddAddress(false)} />
      )}
      {openEdit && (
        <EditAddressBox close={() => setOpenEdit(false)} data={editData} />
      )}
    </div>
  );
};

export default Address;
