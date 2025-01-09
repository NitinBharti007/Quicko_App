import SummaryApi from "../common/SummaryApi";
import Axios from "./Axios";

const UploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const res = await Axios({
      ...SummaryApi.uploadImage,
      data: formData,
    });
    return res.json({
      message: "Image Uplaod Succesfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return error;
  }
};

export default UploadImage;
