import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { LuPencil } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

const SubCategoryPage = () => {
  const [openSubCategoryModel, setOpenSubCategoryModel] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const [imageURL, setImageUrl] = useState("");
  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: resData } = res;
      if (resData.success) {
        setData(resData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);
  console.log("data", data);

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
            <button className="border px-4 py-2 bg-green-200 text-black hover:bg-green-400 rounded"><LuPencil size={20} /></button>
            <button className="border px-4 py-2 bg-red-200 text-black hover:text-red-600 rounded"><MdDelete  size={20}/></button>
          </div>
        );
      },
    }),
  ];

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

      <div>
        <DisplayTable data={data} column={column} />
      </div>

      {openSubCategoryModel && (
        <UploadSubCategoryModel close={() => setOpenSubCategoryModel(false)} />
      )}
      {imageURL && <ViewImage url={imageURL} close={() => setImageUrl("")} />}
    </section>
  );
};

export default SubCategoryPage;
