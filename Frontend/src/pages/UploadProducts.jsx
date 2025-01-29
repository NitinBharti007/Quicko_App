import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import UploadImage from "../utils/UploadImage";

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
    const ImageRes = await UploadImage(file);

    const { data: ImgRes } = ImageRes;
    const ImageUrl = ImgRes.data.url;
    setData((prev)=>{
      return{
        ...prev,
        image: [...prev.image, ImageUrl], 
      }
    })
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
                  <FaCloudUploadAlt size={32} />
                  <p>Upload Image</p>
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
              <div>
                {
                  data.image.map((img, index)=>{
                    return(
                      <div>
                        <img src={img} alt="" />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UploadProducts;
