import { Router } from "express";
import auth from "../middleware/auth.js";
import { createProductController } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/create", auth, createProductController);

export default productRouter;
