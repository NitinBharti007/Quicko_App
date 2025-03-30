import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { DisplayPriceInRUpees } from "../utils/DisplayPriceInRupees";
import Divider from "../components/Divider";
import fast from "../assets/Superfast.png";
import fasts from "../assets/off.png";
import wide from "../assets/wides.png";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";

const ProductDisplay = () => {
  const params = useParams();
  const imageContainer = useRef();
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

  const handleScollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };
  const handleScollleft = () => {
    imageContainer.current.scrollLeft -= 100;
  };
  console.log(data);

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
        <div className="grid relative">
          <div
            ref={imageContainer}
            className="flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none"
          >
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
          <div className="w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center">
            <button
              onClick={handleScollleft}
              className="z-10 bg-white relative p-1 rounded-full shadow-lg"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={handleScollRight}
              className="z-10 bg-white relative p-1 rounded-full"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        <div>
          <p>Description</p>
        </div>

      </div>

      <div className="p-4 text-base lg:text-lg">
        <p className="bg-green-300 w-fit px-2 rounded-full">10 min</p>
        <h2 className="text-lg font-semibold lg:text-2xl">{data.name}</h2>
        <p>{data.unit}</p>
        <Divider />
        <div>
          <p>Price</p>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="border border-green-500 px-3 py-2 bg-green-100 rounded w-fit">
              <p className="font-semibold text-lg lg:text-xl">
                {DisplayPriceInRUpees(
                  PriceWithDiscount(data.price, data.discount)
                )}
              </p>
            </div>
            {data.discount !== 0 && (
              <p className="line-through text-xm">
                {DisplayPriceInRUpees(data.price)}
              </p>
            )}
            {data.discount !== 0 && (
              <p className="text-green-600 text-lg lg:text-xl font-semibold">
                {data.discount}% off
              </p>
            )}
          </div>
        </div>
        {data.stock === 0 ? (
          <p className="text-2xl py-2 text-red-500 font-medium">Out of Stock</p>
        ) : (
          <button className="my-4 px-4 py-1 border rounded bg-green-600 hover:bg-green-700 text-white">
            Add
          </button>
        )}
        <h2 className="font-semibold">Why shop from Quicko?</h2>
        <div className="">
          <div className="flex items-center gap-4">
            <img src={fast} alt="" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Superfast Delivery</div>
              <p>
                Get your order delivered to your doorstep at the earliest
                convenience!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <img src={fasts} alt="" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Best Prices & Offers</div>
              <p>
                Enjoy the Best Prices & Exclusive Offers for a Budget-Friendly
                Shopping Experience!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <img src={wide} alt="" className="w-20 h-20" />
            <div className="text-sm">
              <div className="font-semibold">Wide Assortment</div>
              <p>Explore a Vast Assortment of Products to Suit Every Need!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplay;
