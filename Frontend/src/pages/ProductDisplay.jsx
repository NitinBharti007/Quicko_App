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
    imgage: [],
  });
  const [image, setImage] = useState([]);
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
        setImage(resData.data.image[0]);
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

  console.log("data", data);

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-3">
      <div className="col-span-2">
        <div className="h- full w-full">
          <img src={image} alt={image.name} />
        </div>
      </div>
      <div></div>
    </section>
  );
};

export default ProductDisplay;
