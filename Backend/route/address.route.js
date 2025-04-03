import { Router } from "express";
import { createAddress, deleteAddress, getAddress, updateAddress } from "../controllers/address.controller.js";
import auth from "../middleware/auth.js";

const addressRouter = Router();

addressRouter.post("/create", auth, createAddress);
addressRouter.get("/get", auth, getAddress);
addressRouter.put("/update", auth, updateAddress);
addressRouter.delete("/disable", auth, deleteAddress);

export default addressRouter;
