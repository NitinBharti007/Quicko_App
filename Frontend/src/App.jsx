import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import fetchUserDetails from "./utils/fetchUserDetails";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import Axios from "./utils/Axios";
import SummaryApi from "./common/SummaryApi";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import AxiosToastError from "./utils/AxiosToastError";
import GlobalProvider from "./provider/GlobalProvider";
import CartMobile from "./components/CartMobile";
import ScrollToTop from "./components/ScrollToTop";
import { SocketProvider } from "./context/SocketContext";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchData = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const [userData, categoryRes, subCategoryRes] = await Promise.all([
        fetchUserDetails(),
        Axios(SummaryApi?.getCategory),
        Axios(SummaryApi?.getSubCategory),
      ]);

      dispatch(setUserDetails(userData?.data));

      if (categoryRes?.data?.success) {
        dispatch(setAllCategory(categoryRes?.data?.data));
      }

      if (subCategoryRes?.data?.success) {
        dispatch(setAllSubCategory(subCategoryRes?.data?.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <SocketProvider>
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
    </SocketProvider>
  );
}

export default App;
