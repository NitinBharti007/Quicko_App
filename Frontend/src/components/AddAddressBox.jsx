import React from "react";
import { IoClose } from "react-icons/io5";

const AddAddressBox = ({ close }) => {
  return (
    <section className="bg-black fixed top-0 bottom-0 left-0 right-0 bg-opacity-75 z-50">
      <div className="bg-white p-4 w-full max-w-lg mt-8 mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Add Address</h2>
          <div onClick={close} className=" cursor-pointer hover:text-red-600">
            <IoClose size={25} />
          </div>
        </div>
        <form className="mt-2">
            <div className="grid gap-1">
                <label htmlFor="">Address Line :</label>
                <input type="text" id="addressline" className="border bg-blue-50 p-1 rounded"/>
            </div>
          </form>
      </div>
    </section>
  );
};

export default AddAddressBox;
