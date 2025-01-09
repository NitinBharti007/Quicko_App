import React, { useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";

const CategoryPage = () => {
  const [modelOpen, setModelOpen] = useState(false);

  return (
    <section>
      <div className="p-2 shadow-md flex justify-between items-center">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => setModelOpen(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 px-3 rounded py-1"
        >
          Add Category
        </button>
      </div>
      {modelOpen && <UploadCategoryModel close={() => setModelOpen(false)} />}
    </section>
  );
};

export default CategoryPage;
