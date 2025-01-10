import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import Loading from "../components/Loading";
import Nodata from "../components/Nodata";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const CategoryPage = () => {
  const [modelOpen, setModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

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
      return error;
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

      <div className="p-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
        {categoryData.map((category, index) => {
          return (
            <div key={index} className="w-32 h-48 rounded shadow-md">
              <img
                src={category.image}
                alt={category.name}
                className="w-full object-scale-down"
              />
            </div>
          );
        })}
      </div>

      {loading && <Loading />}

      {modelOpen && <UploadCategoryModel fetchData= {fetchCategory} close={() => setModelOpen(false)} />}
    </section>
  );
};

export default CategoryPage;
