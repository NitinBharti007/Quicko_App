import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import UploadImage from "../utils/UploadImage.js";

const UploadCategoryModel = ({ close }) => {
  
  const [data, setData] = useState({
    name: "",
    image: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const res = await UploadImage(file);
    const { data : ImageResponse } = res;
    setData((prev) => {
      return {
        ...prev,
        image : ImageResponse.data.url,
      };
    });
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-900 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white max-w-4xl w-full h-auto p-4 rounded">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Category</h1>
          <button
            onClick={close}
            className="w-fit block ml-auto hover:text-primary-200"
          >
            <IoClose size={25} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="my-3 grid gap-2">
          <div className="grid gap-1">
            <label
              id="categoryName"
              className="block font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="categoryName"
              type="text"
              name="name"
              className="bg-blue-50 p-2 outline-none border focus:border-primary-200 rounded"
              placeholder="Enter category name"
              value={data.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex gap-3 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-40 w-full lg:w-40 rounded flex justify-center items-center">
                {
                  data.image ? (
                    <img src={data.image} alt="image" className="w-full h-full object-cover" />
                  ) : (
                    <p className="text-sm text-neutral-500">No Image</p>
                  )
                }             
              </div>
              <label htmlFor="uploadImage">
                <div
                  type="submit"
                  className={`${
                    !data.name ? "bg-gray-200" : "bg-primary-200"
                  } text-neutral-800 px-3 py-2 rounded cursor-pointer`}
                >
                  Upload Image
                </div>
                <input
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                  type="file"
                  id="uploadImage"
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
