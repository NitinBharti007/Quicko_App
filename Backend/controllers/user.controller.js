import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOtp from "../utils/generateOtp.js";
import verifyOtpTemplate from "../utils/verifyOtpTemplate.js";

//Register User Controller
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields",
        error: true,
        status: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.json({
        message: "Already register email",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify Email by Quicko",
      html: verifyEmailTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    });

    return res.json({
      message: "Register Success",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Verify User Controller
export async function verifyUserController(req, res) {
  try {
    const { code } = req.body;
    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        error: true,
        success: false,
      });
    }
    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return res.json({
      message: "Email Verified",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Login Controller
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
        error: true,
        success: false,
      });
    }
    if (user.status !== "Active") {
      return res.status(400).json({
        message: "User is not active",
        error: true,
        success: false,
      });
    }
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid Password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookieOption);
    res.cookie("refreshToken", refreshToken, cookieOption);

    return res.json({
      message: "Login Successfully",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Logout Controller
export async function logoutUserController(req, res) {
  try {
    const userId = req.userId;
    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookieOption);
    res.clearCookie("refreshToken", cookieOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    return res.json({
      message: "Logout Successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Upload User Avatar
export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId;
    const avatar = req.file;
    const upload = await uploadImageCloudinary(avatar);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return res.json({
      message: "Avatar uploaded successfully",
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Update User Details
export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId;
    const { name, email, mobile, password } = req.body;

    let hashPassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }
    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      }
    );

    return res.json({
      message: "User details updated successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Forgot Password
export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes in milliseconds

    const forgotPassword = await UserModel.findByIdAndUpdate(user._id, {
      forget_password_otp: otp,
      forget_password_expiry: expireTime,
    });

    // Send OTP to user's email
    await sendEmail({
      sendTo: email,
      subject: "Forgot Password OTP from Quicko",
      html: verifyOtpTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return res.json({
      message: "Otp sent to your email",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Verify OTP
export async function verifyOtpController(req, res) {
  try {
    const { otp, email } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    if (user.forget_password_expiry < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
        error: true,
        success: false,
      });
    }
    if (otp !== user.forget_password_otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "OTP verified successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Reset Password
export async function resetPasswordController(req, res) {
  try {
    const { new_password, confirm_password, email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!email || !new_password || !confirm_password) {
      return res.status(400).json({
        message: "Email, new password and confirm password are required",
        error: true,
        success: false,
      });
    }
    if (new_password !== confirm_password) {
      return res.status(400).json({
        message: "Passwords do not match",
        error: true,
        success: false,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
