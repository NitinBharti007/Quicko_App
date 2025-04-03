import React from "react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const EditAddressBox = ({ close, data }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      _id: data._id,
      userId: data.userId,
      address_line: data.address_line,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      mobile: data.mobile,
    },
  });
  const { fetchAddress } = useGlobalContext();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await Axios({
        ...SummaryApi.updateAddress,
        data: {
          ...data,
          address_line: data.address_line,
          city: data.city,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          mobile: data.mobile,
        },
      });
      const { data: resData } = res;
      if (resData.success) {
        toast.success(resData.message);
        if (close) {
          close();
          reset();
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="bg-black fixed top-0 bottom-0 left-0 right-0 bg-opacity-75 z-50 h-screen overflow-auto">
      <div className="bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Edit Address</h2>
          <div onClick={close} className=" cursor-pointer hover:text-red-600">
            <IoClose size={25} />
          </div>
        </div>
        <form className="mt-4 grid gap-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1">
            <label htmlFor="addressline">Address Line :</label>
            <input
              type="text"
              id="addressline"
              className="border bg-blue-50 p-2 rounded"
              {...register("address_line", { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="city">City :</label>
            <input
              type="text"
              id="city"
              className="border bg-blue-50 p-2 rounded"
              {...register("city", { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="state">State :</label>
            <input
              type="text"
              id="state"
              className="border bg-blue-50 p-2 rounded"
              {...register("state", { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="country">Country :</label>
            <input
              type="text"
              id="country"
              className="border bg-blue-50 p-2 rounded"
              {...register("country", { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="pincode">Pincode :</label>
            <input
              type="number"
              id="pincode"
              className="border bg-blue-50 p-2 rounded"
              {...register("pincode", { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="phone">Phone :</label>
            <input
              type="tel"
              id="phone"
              className="border bg-blue-50 p-2 rounded"
              {...register("mobile", { required: true })}
            />
          </div>
          <button
            type="submit"
            className="bg-primary-200 w-full text-white px-4 py-2 rounded-md"
          >
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditAddressBox;
