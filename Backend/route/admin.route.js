import { Router } from "express";
import { getAllOrdersForAdmin, updateOrderStatus, getAllAddressesForAdmin } from "../controllers/Admin.controller.js";
import auth from "../middleware/auth.js";

const adminRouter = Router();

adminRouter.get("/all-orders", auth, getAllOrdersForAdmin);
adminRouter.post("/update-order-status", auth, updateOrderStatus);
adminRouter.get("/all-addresses", auth, getAllAddressesForAdmin);

export default adminRouter;
