import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();
  const params = useLocation();
  const searchParams = new URLSearchParams(params.search);
  const searchText = searchParams.get('search') || '';

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);
  const redirectToSearchPage = () => {
    navigate("/search");
  };
  const handleChange = (e) => {
    const value = e.target.value;
    const url = `/search?search=${value}`;
    navigate(url);
  };
  return (
    <div className="w-ful min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-md border overflow-hidden flex items-center text-neutral-700 bg-slate-50 group focus-within:border-primary-200">
      <div>
        {!(isSearchPage && isMobile) ? (
          <button className="flex justify-center items-center h-full p-3 group-focus-within:text-primary-200">
            <CiSearch size={23} />
          </button>
        ) : (
          <Link
            to={"/"}
            className="flex justify-center items-center h-full p-1.5 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md"
          >
            <FaArrowLeft size={22} />
          </Link>
        )}
      </div>
      <div className="w-full h-full flex items-center">
        {!isSearchPage ? (
          <div onClick={redirectToSearchPage}>
            <TypeAnimation
              sequence={[
                'Search "milk"',
                1000,
                'Search "eggs"',
                1000,
                'Search "bread"',
                1000,
                'Search "butter"',
                1000,
                'Search "cheese"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "chips"',
                1000,
                'Search "biscuits"',
                1000,
                'Search "detergent"',
                1000,
                'Search "shampoo"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              style={{ fontSize: "1em", display: "inline-block" }}
              repeat={Infinity}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search for atta, dal and more..."
              autoFocus
              defaultValue={searchText}
              className="w-full h-full outline-none"
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
