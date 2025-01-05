import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuEyeClosed } from "react-icons/lu";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const ResetPassword = () => {
  const [data, setData] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/");
    }
    if (location?.state?.email) {
      setData((prev) => {
        return { ...prev, email: location?.state?.email };
      });
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const ValidColor = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.new_password !== data.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data,
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
        setData({
          email: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="container mx-auto w-full">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-6 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-green-700">
          <span className="text-primary-200">Welcome</span> to Quicko!
        </h2>
        <p className="text-center text-gray-600">Reset your password</p>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
          <div className="grid gap-1">
            <label htmlFor="newPassword" className="font-medium">
              New Password:
            </label>
            <div
              className={
                "bg-blue-50 p-2 border rounded flex items-center focus-within:outline focus-within:outline-primary-100"
              }
            >
              <input
                type={showNewPassword ? "text" : "password"}
                id="password"
                name="new_password"
                className="w-full bg-transparent outline-none text-gray-700"
                value={data.new_password}
                onChange={handleChange}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="text-gray-500 hover:text-gray-700 ml-2 focus:outline-none"
                aria-label="Toggle Password Visibility"
              >
                {showNewPassword ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <LuEyeClosed size={20} />
                )}
              </button>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="confirmPassword" className="font-medium">
              Confirm New Password:
            </label>
            <div
              className={
                "bg-blue-50 p-2 border rounded flex items-center focus-within:outline focus-within:outline-primary-100"
              }
            >
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                id="password"
                name="confirm_password"
                className="w-full bg-transparent outline-none text-gray-700"
                value={data.confirm_password}
                onChange={handleChange}
                placeholder="Re-enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                className="text-gray-500 hover:text-gray-700 ml-2 focus:outline-none"
                aria-label="Toggle Confirm Password Visibility"
              >
                {showConfirmNewPassword ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <LuEyeClosed size={20} />
                )}
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className={`${
                ValidColor ? "bg-green-800 hover:bg-green-700" : "bg-gray-800"
              } disabled w-full text-white tracking-wide py-2 rounded font-medium transition`}
            >
              Reset Password
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-green-700 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ResetPassword;
