import React from "react";
import { DisplayPriceInRUpees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { validUrl } from "../utils/ValidURL";

const CardProduct = ({ data }) => {
    const url = `/product/${validUrl(data.name)}-${data._id}`
  return (
    <Link to={url} className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded bg-white">
      <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-scale-down lg:scale-125"
        />
      </div>
      <div className="rounded text-xs w-fit bg-green-50 text-green-500 p-[1px] px-2">
        10 min
      </div>
      <div className="px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2">{data.name}</div>
      <div className="w-fit px-2 lg:px-0 text-sm lg:text-base">{data.unit}</div>
      <div className="px-2 lg:px-0 flex items-center justify-between gap-3 text-sm lg:text-base">
        <div className="font-semibold">
          {DisplayPriceInRUpees(data.price)}
        </div>
        <div className="border bg-green-600 hover:bg-green-700 text-white px-3 lg:px-4 py-1 rounded">
            <button>Add</button>
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
