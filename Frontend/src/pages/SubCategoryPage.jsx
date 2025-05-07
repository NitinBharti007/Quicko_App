import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import EditSubCategory from "../components/EditSubCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";

const SubCategoryPage = () => {
  const [openSubCategoryModel, setOpenSubCategoryModel] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const [imageURL, setImageUrl] = useState("");
  const [openEditSubCategory, setOpenEditSubCategory] = useState(false);
  const [openDeleteBox, setOpenDeleteBox] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
  });
  const [deleteData, setDeleteData] = useState({
    _id: "",
  });
  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      console.log('Fetching subcategories...'); // Debug log
      
      const res = await Axios({
        ...SummaryApi.getSubCategory,
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Subcategories response:', res); // Debug log
      
      const { data: resData } = res;
      if (resData.success) {
        setData(resData.data);
        console.log('Subcategories data set:', resData.data); // Debug log
      } else {
        console.error('API returned unsuccessful response:', resData);
        toast.error(resData.message || "Failed to fetch subcategories");
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error.response || error);
      toast.error(error.response?.data?.message || "Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteData,
      });
      const { data: resData } = res;
      if (resData.success) {
        toast.success("Sub Category Deleted");
        setOpenDeleteBox(false);
        setOpenSubCategoryModel(false);
        fetchSubCategory();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);
  
  const column = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-10 h-15 cursor-pointer"
              onClick={() => setImageUrl(row.original.image)}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {row.original.category.map((category, index) => (
              <p
                key={category._id + "table"}
                className="shadow-md px-1 inline-block"
              >
                {category.name}
              </p>
            ))}
          </>
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => {
                setOpenEditSubCategory(true);
                setEditData(row.original);
              }}
              className="border px-4 py-2 bg-green-200 text-black hover:text-green-500 rounded"
            >
              <MdModeEdit size={20} />
            </button>
            <button
              onClick={() => {
                setOpenDeleteBox(true);
                setDeleteData(row.original);
              }}
              className="border px-4 py-2 bg-red-200 text-black hover:text-red-600 rounded"
            >
              <MdDelete size={20} />
            </button>
          </div>
        );
      },
    }),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading all SubCategory...</p>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="p-2 shadow-md flex justify-between items-center">
        <h2 className="font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenSubCategoryModel(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 px-3 rounded py-1"
        >
          Add Sub Category
        </button>
      </div>

      <div className="overflow-auto w-full max-w-[95vw]">
        <DisplayTable data={data} column={column} />
      </div>

      {openSubCategoryModel && (
        <UploadSubCategoryModel fetchData={fetchSubCategory} close={() => setOpenSubCategoryModel(false)} />
      )}
      {imageURL && <ViewImage url={imageURL} close={() => setImageUrl("")} />}

      {openEditSubCategory && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEditSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {openDeleteBox && (
        <ConfirmBox
          cancel={() => setOpenDeleteBox(false)}
          confirm={() => handleDeleteSubCategory()}
          data={deleteData}
          close={() => setOpenDeleteBox(false)}
          fetchData={fetchSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategoryPage;