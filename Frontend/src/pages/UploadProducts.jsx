import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import UploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddMoreFields from "../components/AddMoreFields";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import SuccessAlert from "../utils/SuccessAlert";

const UploadProducts = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });
  const [loading, setloading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const [fieldName, setFieldName] = useState("");
  const [openAddFields, setOpenAddFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setloading(true);
    const ImageRes = await UploadImage(file);
    const { data: ImgRes } = ImageRes;
    const ImageUrl = ImgRes.data.url;
    setData((prev) => {
      return {
        ...prev,
        image: [...prev.image, ImageUrl],
      };
    });
    setloading(false);
  };

  const handleDeleteImage = () => {
    setData((prev) => {
      return {
        ...prev,
        image: [...prev.image.slice(0, -1)],
      };
    });
  };

  const handleDeleteCategory = () => {
    setData((prev) => {
      return {
        ...prev,
        category: [...prev.category.slice(0, -1)],
      };
    });
  };

  const handleDeleteSubCategory = () => {
    setData((prev) => {
      return {
        ...prev,
        subCategory: [...prev.subCategory.slice(0, -1)],
      };
    });
  };

  const handleAddField = () => {
    setData((prev) => {
      return {
        ...prev,
        more_details: {
          ...prev.more_details,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddFields(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios({
        ...SummaryApi.createProducts,
        data: data,
      });
      const { data: resData } = res;
      if (resData.success) {
        SuccessAlert(resData.message);
      }
      setData({
        name: "",
        image: [],
        category: [],
        subCategory: [],
        unit: "",
        stock: "",
        price: "",
        discount: "",
        description: "",
        more_details: {},
      });
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section>
      <div className="p-2 shadow-md flex justify-between items-center">
        <h2 className="font-semibold">Upload Products</h2>
      </div>
      <div className="p-4">
        <form className="grid gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter product name"
              value={data.name}
              onChange={handleChange}
              required
              className="border outline-none bg-blue-50 w-full p-2 focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="description" className="font-semibold">
              Description
            </label>
            <textarea
              id="description"
              type="text"
              name="description"
              placeholder="Enter product description"
              value={data.description}
              onChange={handleChange}
              required
              rows={3}
              className="border outline-none bg-blue-50 w-full p-2 focus-within:border-primary-200 rounded resize-none"
            />
          </div>
          <div>
            <p className="font-semibold">Image</p>
            <div>
              <label
                htmlFor="productImage"
                className="bg-blue-50 h-28 border rounded flex justify-center items-center cursor-pointer"
              >
                <div className=" flex flex-col justify-center items-center">
                  {loading ? (
                    <Loading />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={32} />
                      <p>Upload Image</p>
                    </>
                  )}

                  <input
                    type="file"
                    id="productImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUploadImage}
                  />
                </div>
              </label>
              {/* Uploaded Image  */}
              <div className="flex flex-wrap gap-4">
                {data.image.map((img, index) => {
                  return (
                    <div
                      key={img + index}
                      className="h-20 w-20 mt-1 min-w-20 bg-blue-50 border relative group"
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-scale-down cursor-pointer"
                        onClick={() => setViewImageURL(img)}
                      />
                      <div
                        onClick={handleDeleteImage}
                        className="absolute bottom-0 right-0 bg-red-500 hover:bg-red-600 p-1 rounded-l-full cursor-pointer text-white hidden group-hover:block"
                      >
                        <MdDelete />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="category" className="font-semibold">
              Category
            </label>
            <div>
              <select
                className="border bg-blue-50 w-full p-2 rounded"
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find((el) => el._id === value);
                  setData((prev) => {
                    return {
                      ...prev,
                      category: [...prev.category, category],
                    };
                  });
                  setSelectCategory("");
                }}
              >
                <option value={""}>Select Category</option>
                {allCategory.map((c, index) => {
                  return (
                    <option key={c + index} value={c?._id}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
              <div className="flex flex-wrap gap-2">
                {data.category.map((c, index) => {
                  return (
                    <div
                      key={c._id + index}
                      className="flex text-sm items-center gap-1 border p-1 mt-2"
                    >
                      <p>{c.name}</p>
                      <div
                        onClick={handleDeleteCategory}
                        className=" hover:text-red-500 cursor-pointer"
                      >
                        <IoClose size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="category" className="font-semibold">
              Sub Category
            </label>
            <div>
              <select
                className="border bg-blue-50 w-full p-2 rounded"
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const subCategory = allSubCategory.find(
                    (el) => el._id === value
                  );
                  setData((prev) => {
                    return {
                      ...prev,
                      subCategory: [...prev.subCategory, subCategory],
                    };
                  });
                  setSelectSubCategory("");
                }}
              >
                <option value={""}>Select Sub Category</option>
                {allSubCategory.map((c, index) => {
                  return (
                    <option key={c + index} value={c?._id}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
              <div className="flex flex-wrap gap-2">
                {data.subCategory.map((c, index) => {
                  return (
                    <div
                      key={c._id + index}
                      className="flex text-sm items-center gap-1 border p-1 mt-2"
                    >
                      <p>{c.name}</p>
                      <div
                        onClick={handleDeleteSubCategory}
                        className=" hover:text-red-500 cursor-pointer"
                      >
                        <IoClose size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit" className="font-semibold">
              Unit
            </label>
            <input
              id="unit"
              type="text"
              name="unit"
              placeholder="Enter product unit"
              value={data.unit}
              onChange={handleChange}
              required
              className="border outline-none bg-blue-50 w-full p-2 focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="stock" className="font-semibold">
              Number of Stock
            </label>
            <input
              id="stock"
              type="number"
              name="stock"
              placeholder="Enter product stock"
              value={data.stock}
              onChange={handleChange}
              required
              className="border outline-none bg-blue-50 w-full p-2 focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="price" className="font-semibold">
              Price
            </label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Enter product price"
              value={data.price}
              onChange={handleChange}
              required
              className="border outline-none bg-blue-50 w-full p-2 focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="discount" className="font-semibold">
              Discount
            </label>
            <input
              id="discpunt"
              type="number"
              name="discount"
              placeholder="Enter product discount"
              value={data.discount}
              onChange={handleChange}
              required
              className="border outline-none bg-blue-50 w-full p-2 focus-within:border-primary-200 rounded"
            />
          </div>
          {Object?.keys(data?.more_details)?.map((k, index) => {
            return (
              <div key={index} className="grid gap-1">
                <label htmlFor={k} className="font-semibold">
                  {k}
                </label>
                <input
                  id={k}
                  type="text"
                  name={k}
                  placeholder={`Enter product ${k}`}
                  value={data?.more_details[k]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setData((prev) => {
                      return {
                        ...prev,
                        more_details: { ...prev.more_details, [k]: value },
                      };
                    });
                  }}
                  required
                  className="border outline-none bg-blue-50 w-full p-2 focus-within:border-primary-200 rounded"
                />
              </div>
            );
          })}
          <div
            onClick={() => setOpenAddFields(true)}
            className="hover:bg-primary-200 bg-white border border-primary-200 hover:text-neutral-900 w-28 py-1 px-3 font-semibold text-center rounded cursor-pointer"
          >
            Add Fields
          </div>
          <button className="border py-2 font-semibold tracking-wider rounded bg-primary-200 hover:bg-primary-100">
            Submit
          </button>
        </form>
      </div>
      {viewImageURL && (
        <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />
      )}
      {openAddFields && (
        <AddMoreFields
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddFields(false)}
        />
      )}
    </section>
  );
};

export default UploadProducts;
