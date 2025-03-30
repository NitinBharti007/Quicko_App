export const baseURL = "https://quicko-app-backend.onrender.com";

const SummaryApi = {
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  forgotPassword: {
    url: "/api/user/forgot-password",
    method: "put",
  },
  verifyOtp: {
    url: "/api/user/verify-forgot-otp-password",
    method: "put",
  },
  resetPassword: {
    url: "/api/user/reset-password",
    method: "put",
  },
  refreshToken: {
    url: "/api/user/refresh-token",
    method: "post",
  },
  userDetails: {
    url: "/api/user/user-details",
    method: "get",
  },
  logout: {
    url: "/api/user/logout",
    method: "get",
  },
  updateAvatar: {
    url: "/api/user/upload-avatar",
    method: "put",
  },
  updateUser: {
    url: "/api/user/update-user",
    method: "put",
  },
  addCategory: {
    url: "/api/category/add-category",
    method: "post",
  },
  uploadImage: {
    url: "/api/file/upload",
    method: "post",
  },
  getCategory: {
    url: "/api/category/get-category",
    method: "get",
  },
  updateCategory: {
    url: "/api/category/update-category",
    method: "put",
  },
  deleteCategory: {
    url: "/api/category/delete-category",
    method: "delete",
  },
  addSubCategory: {
    url: "/api/subCategory/add-subCategory",
    method: "post",
  },
  getSubCategory: {
    url: "/api/subCategory/get-subCategory",
    method: "post",
  },
  updateSubCategory: {
    url: "/api/subCategory/update-subCategory",
    method: "put",
  },
  deleteSubCategory: {
    url: "/api/subCategory/delete-subCategory",
    method: "delete",
  },
  createProducts: {
    url: "/api/product/create",
    method: "post",
  },
  getProducts: {
    url: "/api/product/get",
    method: "post",
  },
  getProductByCategory: {
    url: "/api/product/get-product-by-category",
    method: "post",
  },
  getProductByCategoryAndSubCategory: {
    url: "/api/product/get-product-by-category-and-subCategory",
    method: "post",
  },
  getProductDetails: {
    url: "/api/product/product-details",
    method: "post",
  },
  updateProductDetails: {
    url: "/api/product/update-product-details",
    method: "put",
  },
  deleteProduct: {
    url: "/api/product/delete-product",
    method: "delete",
  },
};

export default SummaryApi;
