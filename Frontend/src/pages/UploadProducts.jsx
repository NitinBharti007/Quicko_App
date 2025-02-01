import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import UploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";

const UploadProducts = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: [],
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });
  const [loading, setloading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setloading(true);
    const ImageRes = await UploadImage(file);
    const { data: ImgRes } = ImageRes;
    const ImageUrl = ImgRes.data.url;
    setData((prev) => {
      return {
        ...prev,
        image: [...prev.image, ImageUrl],
      };
    });
    setloading(false);
  };

  const handleDeleteImage = () => {
    setData((prev) => {
      return {
        ...prev,
        image: [...prev.image.slice(0, -1)],
      };
    });
  };

  return (
    <section>
      <div className="p-2 shadow-md flex justify-between items-center">
        <h2 className="font-semibold">Upload Products</h2>
      </div>
      <div className="p-4">
        <form className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter product name"
              value={data.name}
              onChange={handleChange}
              required
              className="border outline-none bg-blue-50 w-full p-2 focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              type="text"
              name="description"
              placeholder="Enter product description"
              value={data.description}
              onChange={handleChange}
              required
              rows={3}
              className="border outline-none bg-blue-50 w-full p-2 focus-within:border-primary-200 rounded resize-none"
            />
          </div>
          <div>
            <p>Image</p>
            <div>
              <label
                htmlFor="productImage"
                className="bg-blue-50 h-28 border rounded flex justify-center items-center cursor-pointer"
              >
                <div className=" flex flex-col justify-center items-center">
                  {loading ? (
                    <Loading />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={32} />
                      <p>Upload Image</p>
                    </>
                  )}

                  <input
                    type="file"
                    id="productImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUploadImage}
                  />
                </div>
              </label>
              {/* Uploaded Image  */}
              <div className="my-2 flex flex-wrap gap-4">
                {data.image.map((img, index) => {
                  return (
                    <div
                      key={img + index}
                      className="h-20 w-20 min-w-20 bg-blue-50 border relative group"
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-scale-down cursor-pointer"
                        onClick={() => setViewImageURL(img)}
                      />
                      <div
                        onClick={handleDeleteImage}
                        className="absolute bottom-0 right-0 bg-red-500 hover:bg-red-600 p-1 rounded-l-full cursor-pointer text-white hidden group-hover:block"
                      >
                        <MdDelete />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
        </form>
      </div>
      {viewImageURL && (
        <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />
      )}
    </section>
  );
};

export default UploadProducts;
