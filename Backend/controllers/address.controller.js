import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const createAddress = async (req, res) => {
  try {
    const { address_line, city, state, country, pincode, mobile } = req.body;
    const userId = req.userId;
    const createAddress = await AddressModel({
      address_line,
      city,
      state,
      country,
      pincode,
      mobile,
      userId: userId,
    });
    const savedAddress = await createAddress.save();
    const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
      $push: { address_details: savedAddress._id },
    });
    res.status(201).json({
      success: true,
      message: "Address created successfully",
      address: savedAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await AddressModel.find({ userId: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: data,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { _id, address_line, city, state, country, pincode, mobile } =
      req.body;
    const userId = req.userId;
    const updateAddress = await AddressModel.updateOne(
      { _id: _id, userId: userId },
      {
        address_line,
        city,
        state,
        country,
        pincode,
        mobile,
      }
    );
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updateAddress,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { _id } = req.body;
    const userId = req.userId;
    const disableAddress = await AddressModel.updateOne(
      { _id: _id, userId },
      { status: false }
    );
    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      address: disableAddress,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
};
