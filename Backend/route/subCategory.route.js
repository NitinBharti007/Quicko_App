import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addSubCategoryController,
  getSubCategoryController,
} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/add-subCategory", auth, addSubCategoryController);
subCategoryRouter.post("/get-subCategory", getSubCategoryController);

export default subCategoryRouter;
