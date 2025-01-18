import SubCategoryModel from "../models/subCategory.model.js";

export const addSubCategoryController = async (req, res) => {
  try {
    const { name, image, category } = req.body;
    if (!name && !image && !category[0]) {
      return res.status(400).json({
        message: "Please fill in all fields",
        error: true,
        success: false,
      });
    }
    const payload = {
      name,
      image,
      category,
    };
    const addSubCategory = new SubCategoryModel(payload);
    const saveSubCategory = await addSubCategory.save();
    if (!saveSubCategory) {
      return res.status(500).json({
        message: "Sub Category not created",
        error: true,
        success: false,
      });
    }
    return res.json({
      message: "Sub Category created successfully",
      error: false,
      success: true,
      data: saveSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getSubCategoryController = async (req, res) => {
  try {
    const data = await SubCategoryModel.find()
      .sort({ createdAt: -1 })
      .populate("category");
    return res.json({
      data: data,
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
