import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LuEyeClosed } from "react-icons/lu";
import { AiOutlineEye } from "react-icons/ai";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!data.name) newErrors.name = "Name is required";
    if (!data.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = "Enter a valid email";
    if (!data.password) newErrors.password = "Password is required";
    else if (data.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (data.password !== data.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const ValidColor = Object.values(data).every((el) => el);
  return (
    <section className="container mx-auto w-full">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-6 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-green-700">
          Welcome to Quicko!
        </h2>
        <p className="text-center text-gray-600">Log into your account</p>
        <form className="grid gap-4 mt-6">
          <div className="grid gap-1">
            <label htmlFor="email" className="font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`bg-blue-50 p-2 border rounded focus:outline-primary-100 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
            )}
          </div>
          <div className="grid gap-1">
            <label htmlFor="password" className="font-medium">
              Password:
            </label>
            <div
              className={`bg-blue-50 p-2 border rounded flex items-center focus-within:outline focus-within:outline-primary-100 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
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
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password}</span>
            )}
          </div>
          <div>
            <button
              type="submit"
              className={` ${ValidColor ? "bg-green-800 hover:bg-green-700" : "bg-gray-600"} w-full  text-white tracking-wide py-2 rounded font-medium transition`}
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Don't have account?{" "}
          <Link
            to={"/register"}
            className="text-green-700 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
