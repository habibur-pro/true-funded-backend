import { Router } from "express";
import auth from "../../middlewares/auth";
import { OrderController } from "./ordder.controller";

const router = Router();

router.post("/", auth(), OrderController.placeOrder);
export const OrderRoutes = router;
