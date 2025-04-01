import { Router } from "express";
import auth from "../middleware/auth.js";
import { addToCartItemController, getCartItemsController, removeCartItemController, updateCartItemController } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/create", auth, addToCartItemController);
cartRouter.get("/get", auth, getCartItemsController);
cartRouter.put("/update-quantity", auth, updateCartItemController);
cartRouter.delete("/delete", auth, removeCartItemController);

export default cartRouter;
