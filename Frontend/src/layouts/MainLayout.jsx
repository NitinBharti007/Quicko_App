import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import CartMobile from "../components/CartMobile";
import ScrollToTop from "../components/ScrollToTop";

function MainLayout() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Header />
      <Toaster position="top-center" />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      {location.pathname !== "/checkout" && <CartMobile />}
    </>
  );
}

export default MainLayout; 