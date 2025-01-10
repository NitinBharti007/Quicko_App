import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  AddCategoryController,
  GetCategoryController,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/add-category", auth, AddCategoryController);
categoryRouter.get("/get-category", GetCategoryController);

export default categoryRouter;
