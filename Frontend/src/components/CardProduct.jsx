import React, { useState } from "react";
import { DisplayPriceInRUpees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { validUrl } from "../utils/ValidURL";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";
import AddToCart from "./AddToCart";

const CardProduct = ({ data }) => {
  const url = `/product/${validUrl(data.name)}-${data._id}`;

  return (
    <Link
      to={url}
      className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded bg-white"
    >
      <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-scale-down lg:scale-125"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="rounded text-xs w-fit bg-green-50 text-green-500 p-[1px] px-2">
          10 min
        </div>
        <div>
          {data.discount !== 0 && (
            <p className="text-xs bg-green-50 w-fit text-green-500 px-2 rounded">
              {data.discount}% off
            </p>
          )}
        </div>
      </div>
      <div className="px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2">
        {data.name}
      </div>
      <div className="w-fit px-2 lg:px-0 text-sm lg:text-base">{data.unit}</div>
      <div className="px-2 lg:px-0 flex items-center justify-between gap-3 text-sm lg:text-base">
        <div className="flex items-center gap-1">
          <div className="font-semibold">
            {DisplayPriceInRUpees(PriceWithDiscount(data.price, data.discount))}
          </div>
        </div>
        <div className="">
          {data.stock === 0 ? (
            <p className="text-red-500 text-sm text-ellipsis text-center">
              Out Of Stock
            </p>
          ) : (
            <AddToCart data={data} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
