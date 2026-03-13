import { RequestHandler } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentServices } from "./payment.service";

const createPayment = catchAsync(async (req, res) => {
  // const user = req.user
  // req.body.createdBy = user._id
  const result = await PaymentServices.createPaymentIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
});

const getAllPayment: RequestHandler = catchAsync(async (req, res) => {
  const result = await PaymentServices.getAllPaymentFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    // meta: result.meta,
    data: result,
  });
});

const getSinglePayment: RequestHandler = catchAsync(async (req, res) => {
  const result = await PaymentServices.getSinglePaymentFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const updatePayment: RequestHandler = catchAsync(async (req, res) => {
  const result = await PaymentServices.updatePaymentIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment updated successfully",
    data: result,
  });
});

const deletePayment: RequestHandler = catchAsync(async (req, res) => {
  const result = await PaymentServices.deletePaymentFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment deleted successfully",
    data: result,
  });
});

const handleCryptoWebhook = catchAsync(async (req, res) => {
  //  verity signature
  const payload = req.body;
  console.log("crypto webhook payload", payload);
  // PaymentUtils.verifySignature(payload.token, payload.invoice_id);
  let result;
  const type = payload.status;

  switch (type) {
    case "success":
      // console.log('crypto from success condition', type);
      result = await PaymentServices.handleCryptoPaymentSuccess(payload);
      break;
    case "cancel":
      result = await PaymentServices.handleCancelInvoice(payload);
      break;
    default:
      result = { message: "webhook processed successfully" };
      break;
  }

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "challenge ",
    data: result,
  });
});

export const PaymentControllers = {
  createPayment,
  getAllPayment,
  getSinglePayment,
  updatePayment,
  deletePayment,
  handleCryptoWebhook,
};
