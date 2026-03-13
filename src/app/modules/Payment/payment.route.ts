import express from "express";
import { PaymentControllers } from "./payment.controller";

const router = express.Router();

router.post(
  "/",
  // validateRequest(PaymentValidation.createPaymentValidationSchema),
  PaymentControllers.createPayment,
);

router.get("/", PaymentControllers.getAllPayment);

router.get("/:id", PaymentControllers.getSinglePayment);

router.patch(
  "/:id",
  //  validateRequest(PaymentValidation.createPaymentValidationSchema),
  PaymentControllers.updatePayment,
);

router.delete("/:id", PaymentControllers.deletePayment);

router.post("/crypto-webhook", PaymentControllers.handleCryptoWebhook);

export const PaymentRoutes = router;
