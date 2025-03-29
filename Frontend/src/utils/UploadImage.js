import SummaryApi from "../common/SummaryApi.js";
import Axios from "./Axios.js";

const UploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const res = await Axios({
      ...SummaryApi.uploadImage,
      data: formData,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export default UploadImage;
