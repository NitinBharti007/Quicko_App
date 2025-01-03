import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEyeClosed } from "react-icons/lu";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const ValidColor = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data,
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="container mx-auto w-full">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-6 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-green-700">
          Welcome to Quicko!
        </h2>
        <p className="text-center text-gray-600">Create your account</p>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
          <div className="grid gap-1">
            <label htmlFor="name" className="font-medium">
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              autoFocus
              className={
                "bg-blue-50 p-2 border rounded focus:outline-primary-100"
              }
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="email" className="font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={
                "bg-blue-50 p-2 border rounded focus:outline-primary-100"
              }
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password" className="font-medium">
              Password:
            </label>
            <div
              className={
                "bg-blue-50 p-2 border rounded flex items-center focus-within:outline focus-within:outline-primary-100"
              }
            >
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
          <div className="grid gap-1">
            <label htmlFor="confirmPassword" className="font-medium">
              Confirm Password:
            </label>
            <div
              className={
                "bg-blue-50 p-2 border rounded flex items-center focus-within:outline focus-within:outline-primary-100"
              }
            >
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="w-full bg-transparent outline-none text-gray-700"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-gray-500 hover:text-gray-700 ml-2 focus:outline-none"
                aria-label="Toggle Confirm Password Visibility"
              >
                {showConfirmPassword ? (
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
              Register
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

export default Register;
