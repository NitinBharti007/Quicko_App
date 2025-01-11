import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageCloudinary = async (image) => {
  const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

  const uploadImage = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "Quicko",
      },
      (error, uploadResult) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(new Error("Failed to upload image to Cloudinary"));
        } else if (!uploadResult?.secure_url) {
          reject(new Error("Invalid upload result: Missing secure_url"));
        } else {
          resolve(uploadResult);
        }
      }
    ).end(buffer);
  });

  return uploadImage;
};

export default uploadImageCloudinary;
