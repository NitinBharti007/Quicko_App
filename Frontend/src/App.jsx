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
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import AxiosToastError from "./utils/AxiosToastError";
import GlobalProvider from "./provider/GlobalProvider";
import CartMobile from "./components/CartMobile";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    dispatch(setUserDetails(userData.data));
  };
  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const res = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: resData } = res;
      if (resData.success) {
        dispatch(setAllCategory(resData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };
  const fetchSubCategory = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: resData } = res;
      if (resData.success) {
        dispatch(setAllSubCategory(resData.data));
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <GlobalProvider>
      <Header />
      <Toaster position="top-center" />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {location.pathname !== "/checkout" && <CartMobile />}
    </GlobalProvider>
  );
}

export default App;
