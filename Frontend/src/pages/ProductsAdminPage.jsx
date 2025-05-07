import React, { useEffect, useState } from "react";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";
import Nodata from "../components/Nodata";

const ProductsAdminPage = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.getProducts,
        data: {
          page: page,
          limit: 12,
          search: search,
        },
      });
      const { data: resData } = res;
      if (resData.success) {
        setTotalPageCount(resData.totalNoPage)
        setProductData(resData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((prev) => prev + 1);
    }
  };
  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };
  
  useEffect(() => {
    let flag = true;
    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData();
        flag = false;
      }
    }, 300);
    return () => {
      clearTimeout(interval);
    };
  }, [search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading all products...</p>
        </div>
      </div>
    );
  }
  return (
    <section>
      <div className="p-2 shadow-md flex justify-between items-center gap-2">
        <h2 className="font-semibold">Products</h2>
        <div className="bg-blue-50 h-full min-w-24 max-w-56 ml-auto w-full px-4 flex items-center gap-2 py-2 border focus-within:border-primary-200 rounded">
          <IoSearchOutline size={24} />
          <input
            onChange={handleOnChange}
            className="w-full h-full outline-none bg-transparent"
            type="text"
            value={search}
            placeholder="Search product here..."
          />
        </div>
      </div>
      {/* {loading && <Loading />} */}
      <div className="p-4 bg-blue-50">
        <div className="min-h-[55vh]">
          {!productData && !loading && <Nodata />}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {productData.map((p, index) => {
              return <ProductCardAdmin fetchProductData={fetchProductData} key={index} data={p} />;
            })}
          </div>
        </div>
        <div className="flex justify-between my-4">
          <button
            onClick={handlePrevious}
            className="border px-2 py-1 border-primary-200 hover:bg-primary-200 bg-white"
          >
            Previous
          </button>
          <button className="w-full bg-slate-100">
            {page}/{totalPageCount}
          </button>
          <button
            onClick={handleNext}
            className="border px-6 py-1 bg-white border-primary-200 hover:bg-primary-200"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsAdminPage;
