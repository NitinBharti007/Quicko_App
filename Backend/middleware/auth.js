import jwt from "jsonwebtoken";
const auth = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.accessToken || req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Please login to access this resource",
        error: false,
        success: true,
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid Token",
        error: true,
        success: false,
      });
    }
    req.userId = decode.id;
    next();
  } catch (error) {
    // Handle specific JWT errors with appropriate status codes
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Token expired. Please login again",
        error: true,
        success: false,
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: "Invalid token. Please login again",
        error: true,
        success: false,
      });
    }
    
    // For other errors, return 401 instead of 500
    return res.status(401).json({
      message: "Authentication failed. Please login again",
      error: true,
      success: false,
    });
  }
};

export default auth;
