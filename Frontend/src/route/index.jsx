import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import MobileUserPage from "../pages/MobileUserPage";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import TrackOrder from "../pages/TrackOrder";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProducts from "../pages/UploadProducts";
import ProductsAdminPage from "../pages/ProductsAdminPage";
import AdminPermission from "../layouts/AdminPermission";
import ProductsListPage from "../pages/ProductsListPage";
import ProductDisplay from "../pages/ProductDisplay";
import CartMobilePage from "../pages/CartMobilePage";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import AddressesAdminPage from "../pages/AddressesAdminPage";
import OrdersAdminPage from "../pages/OrdersAdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <OtpVerification />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "mobile-menu",
        element: <MobileUserPage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "orders",
            element: <MyOrders />,
          },
          {
            path: "track-order/:orderId",
            element: <TrackOrder />,
          },
          {
            path: "address",
            element: <Address />,
          },
          {
            path: "category",
            element: (
              <AdminPermission>
                <CategoryPage />
              </AdminPermission>
            ),
          },
          {
            path: "sub-category",
            element: (
              <AdminPermission>
                <SubCategoryPage />
              </AdminPermission>
            ),
          },
          {
            path: "upload-products",
            element: (
              <AdminPermission>
                <UploadProducts />
              </AdminPermission>
            ),
          },
          {
            path: "products",
            element: (
              <AdminPermission>
                <ProductsAdminPage />
              </AdminPermission>
            ),
          },
          {
            path: "admin-addresses",
            element: (
              <AdminPermission>
                <AddressesAdminPage />
              </AdminPermission>
            ),
          },
          {
            path: "admin-orders",
            element: (
              <AdminPermission>
                <OrdersAdminPage />
              </AdminPermission>
            ),
          },
        ],
      },
      {
        path: ":category",
        children: [
          {
            path: ":subCategory",
            element: <ProductsListPage />,
          },
        ],
      },
      {
        path: "/product/:product",
        element: <ProductDisplay />,
      },
      {
        path: "/cart",
        element: <CartMobilePage/>,
      },
      {
        path: "/checkout",
        element: <CheckoutPage/>
      },
      {
        path: "/success",
        element: <Success />,
      },
      {
        path: "/cancel",
        element: <Cancel />,
      },
    ],
  },
]);

export default router;
