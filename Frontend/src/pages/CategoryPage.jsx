import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import Loading from "../components/Loading";
import Nodata from "../components/Nodata";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import EditCategory from "../components/EditCategory";

const CategoryPage = () => {
  const [modelOpen, setModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: resData } = res;
      if (resData.success) {
        setCategoryData(resData.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <section>
      <div className="p-2 shadow-md flex justify-between items-center">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => setModelOpen(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 px-3 rounded py-1"
        >
          Add Category
        </button>
      </div>
      {!categoryData[0] && !loading && <Nodata />}

      <div className="p-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
        {categoryData.map((category, index) => {
          return (
            <div key={index} className="w-32 h-56 rounded shadow-md">
              <img
                src={category.image}
                alt={category.name}
                className="w-full object-scale-down"
              />
              <div className="flex items-center h-8 p-1 gap-1">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(category);
                  }}
                  className="border flex-1  px-2 py-1 bg-green-100 hover:bg-green-200 font-medium rounded"
                >
                  Edit
                </button>
                <button className="border flex-1 px-2 py-1 bg-red-100 text-slate-800 hover:bg-red-200 rounded">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {loading && <Loading />}
      {modelOpen && (
        <UploadCategoryModel
          fetchData={fetchCategory}
          close={() => setModelOpen(false)}
        />
      )}
      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchCategory}
        />
      )}
    </section>
  );
};

export default CategoryPage;
