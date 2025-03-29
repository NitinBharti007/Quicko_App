import React, { useState } from "react";
import EditProductAdmin from "./EditProductAdmin";
import ConfirmBox from "./ConfirmBox";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleCancel = () => {
    setOpenDelete(false);
  };
  const handleDeleteProduct = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id,
        },
      });
      const { data: resData } = res;
      if (resData.success) {
        toast.success(resData.message);
        if (fetchProductData) {
          fetchProductData();
        }
        setOpenDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <div className="w-30 bg-white rounded">
      <div>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full h-full object-scale-down"
        />
      </div>
      <p className="text-ellipsis line-clamp-2">{data?.name}</p>
      <p className="text-slate-400">{data?.unit}</p>
      <div className="grid grid-cols-2 gap-3 py-2 px-1">
        <button
          onClick={() => setEditOpen(true)}
          className="border py-1 text-sm lg:px-1 px-0 border-green-600 text-green-900 bg-green-100 hover:bg-green-300 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="border py-1 text-sm lg:px-0 px-0 border-red-600 text-red-900 bg-red-100 hover:bg-red-300 rounded"
        >
          Delete
        </button>
      </div>
      {editOpen && (
        <EditProductAdmin
          fetchProductData={fetchProductData}
          data={data}
          close={() => setEditOpen(false)}
        />
      )}

      {openDelete && (
        <ConfirmBox
          close={() => setOpenDelete(false)}
          cancel={() => handleCancel()}
          confirm={() => handleDeleteProduct()}
        />
      )}
    </div>
  );
};

export default ProductCardAdmin;
