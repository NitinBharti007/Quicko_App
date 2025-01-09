import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { logout } from "../store/userSlice";
import AxiosToastError from "../utils/AxiosToastError";
import { FaExternalLinkAlt } from "react-icons/fa";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.logout,
      });

      if (res.data.success) {
        if (close) {
          close();
        }
        dispatch(logout());
        localStorage.clear();
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) {
      close();
    }
  };
  return (
    <div>
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.mobile || "Guest"}
        </span>
        <Link
          onClick={handleClose}
          to={"/dashboard/profile"}
          className=" hover:text-primary-200 "
        >
          <FaExternalLinkAlt size={12} />
        </Link>
      </div>
      <Divider />
      <div className="text-sm grid gap-1">

      <Link
          onClick={handleClose}
          to={"/dashboard/category"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          Category
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/sub-category"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          Sub Category
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/upload-products"}
          className="px-2 hover:bg-orange-200 py-1"
        >
         Upload Products
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/products"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          Products
        </Link>

        <Link
          onClick={handleClose}
          to={"/dashboard/orders"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          My Orders
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/address"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          Save Address
        </Link>
        <button
          onClick={handleLogOut}
          className="text-left px-2 hover:bg-orange-200 py-1"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
