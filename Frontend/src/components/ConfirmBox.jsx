import React from "react";
import { IoClose } from "react-icons/io5";

const ConfirmBox = ({ cancel, confirm, close }) => {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800 bg-opacity-75 flex justify-center items-center">
      <div className="w-full max-w-md mx-auto p-4 bg-white rounded">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-slate-800">Permanently Delete</h1>
          <button onClick={close} className="ml-auto">
            <IoClose size={25} />
          </button>
        </div>
        <p className="my-4 text-slate-600">Are you sure you want to delete this permanently?</p>
        <div className="w-fit ml-auto flex items-center gap-5 p-2">
          <button onClick={cancel} className="border border-red-500 text-red-600 hover:bg-red-500 hover:text-white px-4 py-1 rounded">Cancel</button>
          <button onClick={confirm} className="border border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-4 py-1 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;
