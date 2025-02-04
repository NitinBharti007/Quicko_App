import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
import { validUrl } from "../utils/ValidURL";

const ProductsListPage = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [displaySubCategory, setDisplaySubCategory] = useState([]);
  const subCategory = params.subCategory?.split("-");
  const subCategoryName = subCategory
    ?.slice(0, subCategory.length - 1)
    .join(" ");

  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const categoryID = params.category.split("-").slice(-1)[0];
  const subCategoryID = params.subCategory.split("-").slice(-1)[0];
  const fetchCategoryAndSubCateogryID = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryID,
          subCategoryId: subCategoryID,
          page: page,
          limit: 10,
        },
      });
      const { data: resData } = res;
      if (resData.success) {
        if (resData.page == 1) {
          setData(resData.data);
        } else {
          setData([...data, ...resData.data]);
        }
        setTotalPage(resData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategoryAndSubCateogryID();
  }, [params]);

  useEffect(() => {
    const sub = allSubCategory.filter((s) => {
      const filterData = s.category.some((el) => {
        return el._id === categoryID;
      });
      return filterData ? filterData : null;
    });
    setDisplaySubCategory(sub);
  }, [params, allSubCategory]);
  return (
    <section className="sticky top-28 lg:top-20 lg:px-4">
      <div className="container sticky top-28 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
        {/* Sub Category  */}
        <div className="shadow-md max-h-[88vh] overflow-y-scroll scrollbarCustom min-h-[88vh] py-2 bg-white grid gap-2">
          {displaySubCategory.map((s, index) => {
            const link = `/${validUrl(s?.category[0]?.name)}-${
              s?.category[0]?._id
            }/${validUrl(s.name)}-${s._id}`;
            return (
              <Link
                to={link}
                key={index}
                className={`w-full p-2 lg:flex lg:w-full items-center lg:h-16 box-border lg:gap-4 border-b hover:bg-green-100 cursor-pointer ${
                  subCategoryID === s._id ? "bg-green-200" : ""
                }`}
              >
                <div className="w-fit mx-auto max-w-28 lg:mx-0 box-border rounded">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-14 lg:h-14 lg:w-12 h-full object-scale-down"
                  />
                </div>
                <p className="text-xs -mt-6 lg:mt-0 text-center lg:text-left lg:text-base">
                  {s.name}
                </p>
              </Link>
            );
          })}
        </div>
        {/* products */}
        <div className="sticky top-20">
          <div className="bg-white shadow-md p-4 z-10">
            <h3 className="font-semibold">{subCategoryName}</h3>
          </div>
          <div>
            <div className="min-h-[74vh] max-h-[78vh] lg:max-h-[80vh] overflow-y-auto scrollbarCustom relative">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-3">
                {data.map((p, index) => {
                  return <CardProduct data={p} key={index} />;
                })}
              </div>
              {loading && <Loading />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsListPage;
