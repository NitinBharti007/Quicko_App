import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import fetchUserDetails from "./utils/fetchUserDetails";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import Axios from "./utils/Axios";
import SummaryApi from "./common/SummaryApi";
import { addToCart } from "./store/cartSlice";
import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import AxiosToastError from "./utils/AxiosToastError";
import GlobalProvider from "./provider/GlobalProvider";
import CartMobile from "./components/CartMobile";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchData = async () => {
    try {
      const [userData, categoryRes, subCategoryRes] = await Promise.all([
        fetchUserDetails(),
        Axios(SummaryApi.getCategory),
        Axios(SummaryApi.getSubCategory),
      ]);

      dispatch(setUserDetails(userData?.data));

      if (categoryRes.data.success) {
        dispatch(setAllCategory(categoryRes.data.data));
      }

      if (subCategoryRes.data.success) {
        dispatch(setAllSubCategory(subCategoryRes.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <SpeedInsights>
      <GlobalProvider>
        <ScrollToTop />
        <Header />
        <Toaster position="top-center" />
        <main className="min-h-[78vh]">
          <Outlet />
        </main>
        <Footer />
        {location.pathname !== "/checkout" && <CartMobile />}
      </GlobalProvider>
    </SpeedInsights>
  );
}

export default App;
