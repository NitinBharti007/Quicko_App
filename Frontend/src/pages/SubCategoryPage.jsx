import React, { useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";

const SubCategoryPage = () => {
  const [openSubCategoryModel, setOpenSubCategoryModel] = useState(false);
  return (
    <section>
      <div className="p-2 shadow-md flex justify-between items-center">
        <h2 className="font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenSubCategoryModel(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 px-3 rounded py-1"
        >
          Add Sub Category
        </button>
      </div>
      {openSubCategoryModel && (
        <UploadSubCategoryModel close={() => setOpenSubCategoryModel(false)} />
      )}
    </section>
  );
};

export default SubCategoryPage;
