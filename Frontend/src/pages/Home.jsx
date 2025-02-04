import React from "react";
import banner from "../assets/banner.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
import { validUrl } from "../utils/ValidURL";
import { useNavigate } from "react-router-dom";
import CategoryWiseDisplay from "../components/CategoryWiseDisplay";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();
  const handleRedirectProductListPage = (id, cat) => {
    const subCategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id == id;
      });
      return filterData ? true : null;
    });
    const url = `/${validUrl(cat)}-${id}/${validUrl(subCategory.name)}-${
      subCategory._id
    }`;
    navigate(url);
  };
  return (
    <section className="bg-white">
      <div className="container mx-auto my-4">
        <div
          className={`w-full h-full min-h-48 bg-blue-100 rounded ${
            !banner && "animate-pulse my-2"
          } `}
        >
          <img
            src={banner}
            alt="banner"
            className="w-full h-full hidden lg:block"
          />
          <img
            src={bannerMobile}
            alt="banner"
            className="w-full h-full lg:hidden"
          />
        </div>
      </div>
      <div className=" container mx-auto px-4 my-2 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {loadingCategory
          ? new Array(12).fill(null).map((c, index) => {
              return (
                <div
                  key={c + index}
                  className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
                >
                  <div className="bg-blue-100 min-h-20 rounded"></div>
                  <div className="bg-blue-100 h-8 rounded"></div>
                </div>
              );
            })
          : categoryData.map((cat, index) => {
              return (
                <div
                  key={cat + index}
                  className="w-full h-full"
                  onClick={() =>
                    handleRedirectProductListPage(cat._id, cat.name)
                  }
                >
                  <div>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-scale-down cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
      </div>
      {/* Display Category wise products  */}
      {categoryData.map((cat, index) => {
        return (
          <CategoryWiseDisplay key={cat._id} id={cat._id} name={cat.name} />
        );
      })}
    </section>
  );
};

export default Home;
