import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const ValidColor = data.every((el) => el);
  const inputRef = useRef([]);
  const location = useLocation();

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.verifyOtp,
        data: {
          otp: data.join(""),
          email: location?.state?.email,
        },
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/reset-password", {
          state: {
            data: response.data,
            email: location?.state?.email,
          },
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
        <p className="text-center text-gray-600">Otp Verification</p>
        <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
          <div className="grid gap-1">
            <label htmlFor="otp" className="font-medium">
              One Time Password:
            </label>
            <div className="flex items-center gap-2 justify-between mt-3">
              {data.map((el, index) => {
                return (
                  <input
                    key={index}
                    type="text"
                    id="otp"
                    ref={(ref) => {
                      inputRef.current[index] = ref;
                      return ref;
                    }}
                    value={data[index]}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log(value);
                      const newData = [...data];
                      newData[index] = value;
                      setData(newData);
                      if (value && index < 5) {
                        inputRef.current[index + 1].focus();
                      }
                    }}
                    maxLength={1}
                    className="bg-blue-50 p-2 w-full max-w-16 font-semibold text-center border rounded focus:outline-primary-100"
                  />
                );
              })}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className={` ${
                ValidColor ? "bg-green-800 hover:bg-green-700" : "bg-gray-600"
              } w-full  text-white tracking-wide py-2 rounded font-medium transition`}
            >
              Verify Otp
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

export default OtpVerification;
