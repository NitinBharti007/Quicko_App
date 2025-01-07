import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEyeClosed } from "react-icons/lu";
import { AiOutlineEye } from "react-icons/ai";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        navigate("/");
        setData({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const ValidColor = Object.values(data).every((el) => el);
  return (
    <section className="container mx-auto w-full">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-6 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-green-700">
          <span className="text-primary-200">Welcome</span> to Quicko!
        </h2>
        <p className="text-center text-gray-600">Log into your account</p>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
          <div className="grid gap-1">
            <label htmlFor="email" className="font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-blue-50 p-2 border rounded focus:outline-primary-100"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password" className="font-medium">
              Password:
            </label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:outline focus-within:outline-primary-100">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full bg-transparent outline-none text-gray-700"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-500 hover:text-gray-700 ml-2 focus:outline-none"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <LuEyeClosed size={20} />
                )}
              </button>
            </div>
          </div>
          <Link
            to={"/forgot-password"}
            className="block ml-auto hover:text-primary-200 text-sm font-medium"
          >
            Forgot password?
          </Link>
          <div>
            <button
              type="submit"
              className={` ${
                ValidColor ? "bg-green-800 hover:bg-green-700" : "bg-gray-600"
              } w-full  text-white tracking-wide py-2 rounded font-medium transition`}
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Don't have account?{" "}
          <Link
            to={"/register"}
            className="text-green-700 hover:text-green-800 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
