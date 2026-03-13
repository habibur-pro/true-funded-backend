import prisma from "../../../shared/prisma";
import QueryBuilder from "../../../helpers/queryBuilder";
import {
  ChallengeStateStatus,
  ChallengeStatus,
  Payment,
  PaymentStatus,
} from "@prisma/client";
import { TCryptoWebhookPayload } from "./payment.interface";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { getErrorMessage } from "../../../helpers/getErrorMessage";

const createPaymentIntoDB = async (payload: Payment) => {
  const newPayment = await prisma.payment.create({ data: payload });
  return newPayment;
};

const getAllPaymentFromDB = async (query: Record<string, unknown>) => {
  const allpaymentQuery = new QueryBuilder(prisma.payment, query);
  const result = await allpaymentQuery
    .search(["payment"])
    .filter()
    .sort()
    .paginate()
    .execute();
  const pagination = await allpaymentQuery.countTotal();

  return {
    meta: pagination,
    data: result,
  };
};

const getSinglePaymentFromDB = async (id: string) => {
  return await prisma.payment.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
};

const updatePaymentIntoDB = async (id: string, payload: Partial<Payment>) => {
  const updatedPayment = await prisma.payment.update({
    where: { id },
    data: payload,
  });
  return updatedPayment;
};

const deletePaymentFromDB = async (id: string) => {
  return await prisma.payment.delete({
    where: { id },
  });
};

const handleCryptoPaymentSuccess = async (payload: TCryptoWebhookPayload) => {
  console.log("payload", payload);
  if (payload.status != "success") {
    throw new ApiError(httpStatus.BAD_GATEWAY, "payment status must success");
  }
  const payment = await prisma.payment.findFirst({
    where: {
      invoiceId: payload.invoice_id,
    },
  });

  if (!payment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "payment not found");
  }
  if (payment.status === PaymentStatus.SUCCEED) {
    return { message: "payment already paid" };
  }

  const challenge = await prisma.challenge.findFirst({
    where: { paymentId: payment.id },
  });

  if (!challenge) {
    throw new ApiError(httpStatus.BAD_REQUEST, "challenge not fund");
  }
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.SUCCEED },
    });
    await tx.challenge.update({
      where: { id: challenge.id },
      data: { status: ChallengeStatus.ACTIVE },
    });
    await tx.challengeStage.update({
      where: { id: challenge.currentStageId as string },
      data: { status: "ON_GOING" },
    });
  });

  return { message: "challenge updated" };
};

const handleCancelInvoice = async (payload: TCryptoWebhookPayload) => {
  const existPayment = await prisma.payment.findUnique({
    where: {
      id: payload.order_id,
    },
  });

  if (!existPayment) {
    throw new ApiError(httpStatus.NOT_FOUND, "transaction not found");
  }
  await prisma.payment.update({
    where: {
      id: payload.order_id,
    },
    data: {
      status: PaymentStatus.FAILED,
    },
  });
  return { message: "cancel the payment" };
};

export const PaymentServices = {
  createPaymentIntoDB,
  getAllPaymentFromDB,
  getSinglePaymentFromDB,
  updatePaymentIntoDB,
  deletePaymentFromDB,
  handleCancelInvoice,
  handleCryptoPaymentSuccess,
};
