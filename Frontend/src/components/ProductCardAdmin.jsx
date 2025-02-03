import React from "react";

const ProductCardAdmin = ({ data }) => {
  return (
    <div className="w-30 bg-white rounded">
      <div>
        <img src={data?.image[0]} alt={data?.name} className="w-full h-full object-scale-down" />
      </div>
      <p className="text-ellipsis line-clamp-2">{data?.name}</p>
      <p className="text-slate-400">{data?.unit}</p>
    </div>
  );
};

export default ProductCardAdmin;
