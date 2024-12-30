import React from "react";
import logo from "../assets/logo.jpg";

const Header = () => {
  return (
    <header className="h-20 shadow-md sticky top-0">
      <div className="container mx-auto flex items-center h-full px-4 justify-between">
        {/*  Logo  */}
        <div className="h-full">
          <div className="h-full flex items-center justify-center">
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
          </div>
        </div>

        {/* Search */}
        <div>Search</div>

        {/* Login and Cart */}
        <div>Login and cart</div>
      </div>
    </header>
  );
};

export default Header;
