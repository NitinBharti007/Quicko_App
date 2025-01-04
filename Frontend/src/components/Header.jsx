import React from "react";
import logo from "../assets/logo.jpg";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import useMobile from "../hooks/useMobile";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const redirectToLoginPage = () =>{
    navigate("/login");
  }

  const isSearchPage = location.pathname === "/search";
  return (
    <header className="h-28 lg:h-20 lg:shadow-md sticky top-0 flex flex-col justify-center gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          {/*  Logo  */}
          <div className="h-full">
            <Link to={"/"} className="h-full flex items-center justify-center">
              <img
                src={logo}
                width={180}
                height={60}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={130}
                height={60}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

          {/* Search */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/* Login and Cart */}
          <div className="">
            {/* User Icon display only in Mobile Screen  */}
            <button>
              <FaRegCircleUser size={29} className="lg:hidden mt-2" />
            </button>
            {/* Desktop  */}
            <div className="hidden lg:flex mb-6 items-center gap-10">
              <button onClick={redirectToLoginPage} className="text-lg">
                Login
              </button>
              <button className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-2 py-2 mr-2 rounded text-white">
                <div className="animate-bounce">
                  <BsCart4 size={26} />
                </div>
                <div className="font-semibold">
                  <p>My Cart</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container lg:hidden mx-auto px-2">
        <Search />
      </div>
    </header>
  );
};

export default Header;
