import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  AddCategoryController,
  GetCategoryController,
  UpdateCategoryController,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/add-category", auth, AddCategoryController);
categoryRouter.get("/get-category", GetCategoryController);
categoryRouter.put("/update-category", auth, UpdateCategoryController);

export default categoryRouter;
