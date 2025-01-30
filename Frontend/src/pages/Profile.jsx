import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import UserProfileEdit from "../components/UserProfileEdit";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [openUserAvatarEdit, setOpenUserAvatarEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.updateUser,
        data: userData,
      });
      const { data: resData } = res;
      if (resData.success) {
        toast.success(resData.message);
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Profile Upload and Display Image */}
      <div className="w-20 h-20 flex justify-center items-center rounded-full overflow-hidden drop-shadow-sm">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-auto" />
        ) : (
          <FaUserCircle size={70} />
        )}
      </div>
      <button
        onClick={() => setOpenUserAvatarEdit(true)}
        className="text-sm min-w-20 border border-primary-100 rounded-full py-1 mt-2 hover:bg-primary-200"
      >
        Edit
      </button>
      {openUserAvatarEdit && (
        <UserProfileEdit close={() => setOpenUserAvatarEdit(false)} />
      )}

      {/* Name , mobile , email and password change  */}
      <form className="my-4 grid gap-4" onSubmit={handleOnSubmit}>
        <div className="grid">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter Your Name"
            className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            value={userData.name}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="grid">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Your Email"
            className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            value={userData.email}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="grid">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            name="mobile"
            id="mobile"
            placeholder="Enter Your Mobile"
            className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            value={userData.mobile}
            onChange={handleOnChange}
            required
          />
        </div>
        <button className="border px-2 py-2 font-semibold border-primary-200 hover:bg-primary-200 rounded text-primary-200 hover:text-neutral-900">
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
