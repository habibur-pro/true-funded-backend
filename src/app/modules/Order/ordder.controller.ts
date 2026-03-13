import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import OrderService from "./order.service";

const placeOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await OrderService.placeOrder(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order placed successfully!",
    data: result,
  });
});

export const OrderController = {
  placeOrder,
};
