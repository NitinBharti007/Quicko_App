import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";

const fetchUserDetails = async () => {
  try {
    const res = await Axios({
      ...SummaryApi.userDetails,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export default fetchUserDetails;
