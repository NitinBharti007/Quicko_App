import React from "react";
import noDataImage from "../assets/noData1.png";

const Nodata = () => {
  return (
    <div className="flex flex-col justify-center items-center p-10 gap-2">
      <img src={noDataImage} alt="no data" className="w-36" />
      <p className="text-neutral-700 ml-3">No data available</p>
    </div>
  );
};

export default Nodata;
