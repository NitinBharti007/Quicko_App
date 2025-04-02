import React, { useEffect, useState } from "react";
import logo from "../assets/logo.jpg";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import useMobile from "../hooks/useMobile";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPriceInRUpees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import CartSidebar from "./CartSidebar";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const user = useSelector((state) => state?.user);
  const cartItems = useSelector((state) => state?.cartItem?.cart);
  const { totalPrice, totalQuantity } = useGlobalContext();
  const [openCartSidebar, setOpenCartSidebar] = useState(false);
  // const [totalPrice, setTotalPrice] = useState(0);
  // const [totalQuantity, setTotalQuantity] = useState(0);

  // useEffect(() => {
  //   if (cartItems && cartItems.length > 0) {
  //     const totalPrice = cartItems.reduce((acc, item) => {
  //       return acc + (item.productId?.price || 0) * (item.quantity || 0);
  //     }, 0);
  //     setTotalPrice(totalPrice);

  //     const totalQuantity = cartItems.reduce((acc, item) => {
  //       return acc + (item.quantity || 0);
  //     }, 0);
  //     setTotalQuantity(totalQuantity);
  //   } else {
  //     setTotalPrice(0);
  //     setTotalQuantity(0);
  //   }
  // }, [cartItems]);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseOpenMenu = () => {
    setOpenUserMenu(false);
  };

  const handleOpenMenuMobile = () => {
    if (!user._id) {
      navigate("/login");
      return;
    } else {
      navigate("/mobile-menu");
    }
  };
  const isSearchPage = location.pathname === "/search";

  return (
    <header className="h-28 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
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
            <button
              className="text-neutral-600 lg:hidden mt-3"
              onClick={handleOpenMenuMobile}
            >
              <FaRegCircleUser size={29} />
            </button>
            {/* Desktop  */}
            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => {
                      setOpenUserMenu((preve) => !preve);
                    }}
                    className="flex items-center gap-1 cursor-pointer select-none"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={24} />
                    ) : (
                      <GoTriangleDown size={24} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 shadow-lg">
                        <UserMenu close={handleCloseOpenMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className="text-lg">
                  Login
                </button>
              )}

              <button
                onClick={() => setOpenCartSidebar(true)}
                className="flex items-center gap-3 bg-green-800 hover:bg-green-700 px-3 py-2 mr-2 rounded text-white"
              >
                <div className="animate-bounce">
                  <BsCart4 size={26} />
                </div>
                <div className="font-semibold text-sm">
                  {cartItems && cartItems?.length > 0 ? (
                    <div>
                      <p>{totalQuantity} items</p>
                      <p>{DisplayPriceInRUpees(totalPrice)}</p>
                    </div>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container lg:hidden mx-auto px-2">
        <Search />
      </div>

      {openCartSidebar && (
        <CartSidebar close={() => setOpenCartSidebar(false)}/>
      )}
    </header>
  );
};

export default Header;
