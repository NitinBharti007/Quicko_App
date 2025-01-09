import CategoryModel from "../models/category.model.js";

export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({
        message: "Please fill in all fields",
        error: true,
        success: false,
      });
    }
    const addCategory = new CategoryModel({
      name,
      image,
    });
    const saveCategory = await addCategory.save();
    if (!saveCategory) {
      return res.status(500).json({
        message: "Category not created",
        error: true,
        success: false,
      });
    }
    return res.json({
      message: "Category added successfully",
      error: false,
      success: true,
      data: saveCategory,
    });
  } catch (error) {
    return error.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
