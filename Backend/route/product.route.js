import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createProductController,
  deleteProductAdmin,
  getProductByCategory,
  getProductByCategoryAndSubCategory,
  getProductController,
  getProductDetails,
  updateProductDetails,
} from "../controllers/product.controller.js";
import { admin } from "../middleware/Admin.js";

const productRouter = Router();

productRouter.post("/create", auth, admin, createProductController);
productRouter.post("/get", getProductController);
productRouter.post("/get-product-by-category", getProductByCategory);
productRouter.post(
  "/get-product-by-category-and-subCategory",
  getProductByCategoryAndSubCategory
);
productRouter.post("/product-details", getProductDetails);
productRouter.put("/update-product-details", auth, admin, updateProductDetails);
productRouter.delete("/delete-product", auth, admin, deleteProductAdmin);

export default productRouter;
