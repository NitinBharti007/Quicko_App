import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const CategoryWiseDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();

  const fetchCategoryWiseProductDisplay = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id,
        },
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
    fetchCategoryWiseProductDisplay();
  }, []);
  const loadingNumber = new Array(6).fill(null);

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };
  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };
  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="text-lg md:text-xl lg:text-xl font-bold">{name}</h3>
        <Link className="text-green-600 hover:text-green-400 font-medium" to="">
          See All
        </Link>
      </div>
      <div className="relative flex items-center">
        <div
          className="flex gap-3 md:gap-4 lg:gap-5 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth"
          ref={containerRef}
        >
          {loading &&
            loadingNumber.map((_, index) => {
              return <CardLoading key={index} />;
            })}

          {data.map((p, index) => {
            return <CardProduct data={p} key={index} />;
          })}
        </div>
        <div className="w-full absolute hidden lg:flex container left-0 right-0 mx-auto px-2 justify-between">
          <button
            onClick={handleScrollLeft}
            className="z-10 relative bg-white shadow-lg rounded-full p-2 text-lg hover:bg-gray-200"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleScrollRight}
            className="z-10 relative bg-white shadow-lg rounded-full p-2 text-lg hover:bg-gray-200"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseDisplay;
