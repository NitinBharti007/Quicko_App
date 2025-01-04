export const baseURL = "http://localhost:8080";

const SummaryApi = {
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login:{
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
  resetPassword:{
    url: "/api/user/reset-password",
    method: "put",
  }

};

export default SummaryApi