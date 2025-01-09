import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { toast } from "react-hot-toast";
import { updateAvatar } from "../store/userSlice";
import { IoClose } from "react-icons/io5";

const UserProfileEdit = ({close}) => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.updateAvatar,
        data: formData,
      });
      const { data: resData } = res;
      dispatch(updateAvatar(resData.data.avatar));
      toast.success("Profile Updated Successfully");
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  const handleClose = () => {
    setCloseEdit(true);
  };
  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 bg-opacity-70 p-4 flex items-center justify-center">
      <div className="bg-white max-w-xs w-full rounded p-2 flex justify-center items-center flex-col">
        <button
          onClick={close}
          className="text-neutral-800 block w-fit ml-auto hover:text-primary-200"
        >
          <IoClose size={24} />
        </button>
        <div className="w-20 h-20 flex flex-col justify-center items-center rounded-full overflow-hidden drop-shadow-sm mb-2">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-auto" />
          ) : (
            <FaUserCircle size={70} />
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="uploadProfile">
            <div className="border border-primary-200 hover:bg-primary-200 rounded-full px-4 py-1 text-sm mb-4 cursor-pointer">
              {loading ? "Loading..." : "Upload"}
            </div>
          </label>
          <input
            onChange={handleUploadAvatar}
            type="file"
            id="uploadProfile"
            className="hidden"
          />
        </form>
      </div>
    </section>
  );
};

export default UserProfileEdit;
