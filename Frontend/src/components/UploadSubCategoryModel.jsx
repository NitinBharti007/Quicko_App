import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import UploadImage from "../utils/UploadImage";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const UploadSubCategoryModel = ({ close }) => {
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: [],
  });

  const allCategory = useSelector((state) => state.product.allCategory);

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

  const handleDeleteSelectedCategory = (categoryId) => {
    const index = subCategoryData.category.findIndex(
      (el) => el._id === categoryId
    );
    subCategoryData.category.splice(index, 1);
    setSubCategoryData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    try {
      setAdding(true);
      const res = await Axios({
        ...SummaryApi.addSubCategory,
        data: subCategoryData,
      });
      const { data: resData } = res;
      if (resData.success) {
        toast.success(resData.message);
        close();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setAdding(false);
    }
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
        <form onSubmit={handleSubmitSubCategory} className="my-3 grid gap-2">
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
                  {loading ? "Uploading..." : "Upload Image"}
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
          <div className="grid gap-1">
            <label>Select Category</label>
            <div className="border focus-within:border-primary-200 rounded">
              {/* Display Value  */}
              <div className="flex flex-wrap gap-2">
                {subCategoryData.category.map((cat, index) => {
                  return (
                    <p
                      className="bg-white shadow-md px-1 py-0.5 m-2 rounded border border-blue-200 flex justify-around gap-2"
                      key={cat._id}
                    >
                      {cat.name}
                      <div
                        className="cursor-pointer hover:text-red-600"
                        onClick={() => handleDeleteSelectedCategory(cat._id)}
                      >
                        <IoClose />
                      </div>
                    </p>
                  );
                })}
              </div>

              {/* Select Category  */}
              <select
                className="w-full p-2 bg-transparent outline-none border"
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetails = allCategory.find(
                    (el) => el._id === value
                  );
                  setSubCategoryData((prev) => {
                    return {
                      ...prev,
                      category: [...prev.category, categoryDetails],
                    };
                  });
                }}
              >
                <option value={""}>Select Category</option>
                {allCategory.map((category, index) => {
                  return (
                    <option key={index} value={category._id}>
                      {category?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className={`border p-2 rounded tracking-wider font-semibold text-black
         ${
           subCategoryData?.name &&
           subCategoryData?.image &&
           subCategoryData?.category[0]
             ? "bg-primary-200 hover:bg-primary-100"
             : "bg-gray-200 disabled"
         }`}
          >
            {adding ? "Adding..." : "Add Sub Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadSubCategoryModel;
