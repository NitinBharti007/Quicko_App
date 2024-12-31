import React from "react";
import logo from "../assets/logo.jpg";
import Search from "./Search";
import { Link, useLocation } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();

  const isSearchPage = location.pathname === "/search";
  return (
    <header className="h-28 lg:h-20 lg:shadow-md sticky top-0 flex flex-col justify-center gap-1">
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
          <div>
            <button>
              <FaRegCircleUser size={29} className="lg:hidden mt-3" />
            </button>
            <div className="hidden lg:block">Login and cart</div>
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
