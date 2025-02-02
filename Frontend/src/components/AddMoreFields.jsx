import React from "react";
import { IoClose } from "react-icons/io5";

const AddMoreFields = ({ close, value, onChange, submit }) => {
  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800 bg-opacity-75 flex justify-center items-center p-4">
      <div className="w-full max-w-md p-4 bg-white rounded">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold">Add Fields</h1>
          <div onClick={close} className=" cursor-pointer hover:text-red-600">
            <IoClose size={25} />
          </div>
        </div>
        <input
          value={value}
          onChange={onChange}
          className="bg-blue-50 my-3 w-full p-2 border outline-none focus-within:border-primary-100 rounded"
          placeholder="Enter field name"
        />
        <button
          onClick={submit}
          className=" bg-primary-200 px-3 block mx-auto w-fit border right-0 p-2 rounded font-semibold tracking-wide hover:bg-primary-100"
        >
          Add Field
        </button>
      </div>
    </section>
  );
};

export default AddMoreFields;
