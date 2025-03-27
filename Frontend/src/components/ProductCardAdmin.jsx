import React, { useState } from "react";
import EditProductAdmin from "./EditProductAdmin";

const ProductCardAdmin = ({ data }) => {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div className="w-30 bg-white rounded">
      <div>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full h-full object-scale-down"
        />
      </div>
      <p className="text-ellipsis line-clamp-2">{data?.name}</p>
      <p className="text-slate-400">{data?.unit}</p>
      <div className="grid grid-cols-2 gap-3 py-2 px-1">
        <button onClick={()=>setEditOpen(true)} className="border py-1 text-sm px-1 border-green-600 text-green-900 bg-green-100 hover:bg-green-300 rounded">
          Edit
        </button>
        <button className="border py-1 text-sm px-1 border-red-600 text-red-900 bg-red-100 hover:bg-red-300 rounded">
          Delete
        </button>
      </div>
      {editOpen && (
        <EditProductAdmin data={data} close={()=>setEditOpen(false)}/>
      ) }
    </div>
  );
};

export default ProductCardAdmin;
