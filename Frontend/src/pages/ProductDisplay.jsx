import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const ProductDisplay = () => {
  const params = useParams();
  let productID = params?.product?.split("-")?.slice(-1)[0];
  const [data, setData] = useState({
    name: "",
    image: [],
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const fetchProdutsDetails = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productID,
        },
      });
      const { data: resData } = res;
      if (resData.data) {
        setData(resData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutsDetails();
  }, [params]);

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-2">
      <div className="">
        <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
          <img
            src={data.image[image]}
            alt={image.name}
            className="h-full w-full object-scale-down"
          />
        </div>
        <div className="flex justify-center items-center gap-3 my-2">
          {data.image.map((img, index) => {
            return (
              <div
                key={img + index}
                className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${
                  index === image && "bg-slate-400"
                }`}
              ></div>
            );
          })}
        </div>
        <div className="grid">
          <div className="flex gap-4 w-full overflow-x-auto scrollbar-none">
            {data.image.map((img, index) => {
              return (
                <div
                  key={index}
                  className="w-20 h-20 min-h-20 min-w-20 shadow-md"
                >
                  <img
                    src={img}
                    alt={img.name}
                    className="w-full h-full object-scale-down cursor-pointer"
                    onClick={() => setImage(index)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplay;