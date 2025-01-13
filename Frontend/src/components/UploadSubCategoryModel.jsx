import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import UploadImage from "../utils/UploadImage";

const UploadSubCategoryModel = ({ close }) => {
  const [loading, setLoading] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubCategoryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setLoading(true);
    const res = await UploadImage(file);
    const { data: ImageResponse } = res;
    setSubCategoryData((prev) => {
      return {
        ...prev,
        image: ImageResponse.data.url,
      };
    });
    setLoading(false);
  };
  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 z-50 bg-neutral-800 bg-opacity-75 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-4xl rounded p-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-slate-700">Add Sub Category</h1>
          <button className="text-neutral-800" onClick={close}>
            <IoClose size={25} />
          </button>
        </div>
        <form className="my-3 grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="name" className="block font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className="bg-blue-50 p-2 outline-none border focus:border-primary-200 rounded"
              placeholder="Enter sub category name"
              value={subCategoryData.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center">
                {subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt="image"
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>
              <label htmlFor="submitSubCategoryImage">
                <div className="border px-4 py-2 border-primary-100 text-primary-200 rounded hover:bg-primary-200 hover:text-black cursor-pointer">
                  {loading ? "Uploading" : "Upload Image"}
                </div>
                <input
                  type="file"
                  id="submitSubCategoryImage"
                  className="hidden"
                  onChange={handleSubCategoryImageUpload}
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadSubCategoryModel;
