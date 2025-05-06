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
import isAdmin from "../utils/isAdmin";

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
          {user.name || user.mobile}{" "}
          <span className="text-red-600 font-medium">{user.role === "ADMIN" ? "(Admin)" : ""}</span>
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
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/category"}
            className="px-2 hover:bg-orange-200 py-1"
          >
            Category
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/sub-category"}
            className="px-2 hover:bg-orange-200 py-1"
          >
            Sub Category
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/upload-products"}
            className="px-2 hover:bg-orange-200 py-1"
          >
            Upload Products
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/products"}
            className="px-2 hover:bg-orange-200 py-1"
          >
            Products
          </Link>
        )}

        <Link
          onClick={handleClose}
          to={user.role === "ADMIN" ? "/dashboard/admin-orders" : "/dashboard/orders"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          {user.role === "ADMIN" ? "Orders" : "My Orders"}
        </Link>
        <Link
          onClick={handleClose}
          to={user.role === "ADMIN" ? "/dashboard/admin-addresses" : "/dashboard/address"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          {user.role === "ADMIN" ? "Addresses" : "Save Address"}
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
