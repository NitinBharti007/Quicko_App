import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const ForgotPaaaword = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();
  const ValidColor = Object.values(data).every((el) => el);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email) {
      toast.error("Please enter email");
      return;
    }
    try {
      const response = await Axios({
        ...SummaryApi.forgotPassword,
        data: data,
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verify-otp", {
          state: data,
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
        <p className="text-center text-gray-600">Forgot Password?</p>
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
          <div>
            <button
              type="submit"
              className={` ${
                ValidColor ? "bg-green-800 hover:bg-green-700" : "bg-gray-600"
              } w-full  text-white tracking-wide py-2 rounded font-medium transition`}
            >
              Send Otp
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-green-700 hover:text-green-800 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPaaaword;
