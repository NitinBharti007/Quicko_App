import { Router } from "express";
import { 
  CashOnDelivery, 
  paymentController, 
  webhookController, 
  getOrderDetailsController,
  getOrderBySessionController 
} from "../controllers/order.controller.js";
import auth from "../middleware/auth.js";

const orderRouter = Router();

orderRouter.post("/cash-on-delivery", auth, CashOnDelivery);
orderRouter.post("/checkout", auth, paymentController);
orderRouter.get("/get-order-details", auth, getOrderDetailsController);
orderRouter.get("/get-order-by-session", auth, getOrderBySessionController);

export default orderRouter;
