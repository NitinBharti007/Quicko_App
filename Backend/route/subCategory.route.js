import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addSubCategoryController,
  deleteSubCategoryContreoller,
  getSubCategoryController,
  updateSubCategoryController,
} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/add-subCategory", auth, addSubCategoryController);
subCategoryRouter.get("/get-subCategory", getSubCategoryController);
subCategoryRouter.put("/update-subCategory", auth, updateSubCategoryController);
subCategoryRouter.delete("/delete-subCategory", auth, deleteSubCategoryContreoller);

export default subCategoryRouter;
