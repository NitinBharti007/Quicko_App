import CartModel from "../models/cart.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    if (!productId) {
      return res.status(402).json({
        message: "Provide productId",
        error: true,
        success: false,
      });
    }
    const checkItem = await CartModel.findOne({
      userId: userId,
      productId: productId,
    });
    if (checkItem) {
      return res.status(402).json({
        message: "Item already in cart",
        error: true,
        success: false,
      });
    }
    const cartItem = new CartModel({
      quantity: 1,
      userId: userId,
      productId: productId,
    });
    const save = cartItem.save();
    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          shopping_cart: productId,
        },
      }
    );
    return res.json({
      data: save,
      message: "Item added successfully",
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
};

export const getCartItemsController = async (req, res) => {
  try {
    const userId = req.userId;
    const cartItems = await CartModel.find({ userId: userId }).populate(
      "productId"
    );
    return res.json({
      data: cartItems,
      message: "Cart items fetched successfully",
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
};

export const updateCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, quantity } = req.body;
    if (!_id || !quantity) {
      return res.status(402).json({
        message: "Provide _id and quantity",
        error: true,
        success: false,
      });
    }
    const updateCartItem = await CartModel.updateOne(
      { _id: _id, userId: userId },
      { quantity: quantity }
    );
    return res.json({
      data: updateCartItem,
      message: "Item added successfully",
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
};

export const removeCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Provide _id",
        error: true,
        success: false,
      });
    }
    const removeCartItem = await CartModel.deleteOne({
      _id: _id,
      userId: userId,
    });
    return res.json({
      data: removeCartItem,
      message: "Item removed successfully",
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
};

// export const clearCartController = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const clearCart = await CartModel.deleteMany({ userId: userId });
//   }
//   catch(error){
//     return res.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

// export const getCartItemCountController = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const cartItemCount = await CartModel.countDocuments({ userId: userId });
//   }
//   catch(error){
//     return res.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };
