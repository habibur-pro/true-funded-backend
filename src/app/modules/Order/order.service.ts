import config from "../../../config";
import axios from "axios";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { OrderPlacePayload } from "./order.interface";
import prisma from "../../../shared/prisma";
import { Payment } from "@prisma/client";

const createCryptoInvoice = async (payload: {
  user: { email: string };
  amount: number;
  transactionId: string;
}) => {
  // console.log({ payload });
  try {
    const response = await axios.post(
      "https://api.cryptocloud.plus/v2/invoice/create",
      {
        shop_id: config.crypto.shop_id,
        amount: parseFloat(payload.amount.toString()),
        currency: "USD",
        // TODO: replace to admin email
        email_to_send: payload.user?.email,
        order_id: payload.transactionId,
        email: payload.user?.email,
      },
      {
        headers: {
          Authorization: `Token ${config.crypto.api_key}`,
        },
      },
    );
    const result = await response.data;
    console.log("invoice data", result);
    const invoiceId = result.result.uuid.split("INV-")[1];
    return { link: result.result.link, invoiceId };
  } catch (error) {
    // console.log(error);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "filed to create payment invoice",
    );
  }
};

const placeOrder = async (userId: string, payload: OrderPlacePayload) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "user not found");

  const evaluation = await prisma.evaluation.findUnique({
    where: {
      code: payload.pricing.evaluation,
    },
    include: {
      evaluationPhases: true,
    },
  });

  if (!evaluation)
    throw new ApiError(httpStatus.NOT_FOUND, "evaluation not found");

  const newPayment = await prisma.payment.create({
    data: {
      amount: payload.pricing.total,
      paymentMethod: "crypto claude",
      evaluationId: evaluation.id,
      userId: user.id,
    },
  });

  const paymentResponse = await createCryptoInvoice({
    user: { email: user.email },
    amount: payload.pricing.total,
    transactionId: newPayment.id,
  });
  console.log("payment response data from place order", paymentResponse);
  await prisma.payment.update({
    where: {
      id: newPayment.id,
    },
    data: {
      invoiceId: paymentResponse.invoiceId,
    },
  });

  await prisma.$transaction(async (tx) => {
    const newChallenge = await tx.challenge.create({
      data: {
        price: payload.pricing.total,
        fundedAmount: payload.pricing.fundedAmount,
        tradePlatform: payload.pricing.platform,
        evaluationId: evaluation.id,
        paymentId: newPayment.id,
        userId: user.id,
        challengeStages: {
          createMany: {
            data: evaluation.evaluationPhases.map((phase) => ({
              phaseId: phase.id,
              traderPlatform: payload.pricing.platform,
              userId: user.id,
            })),
          },
        },
      },
      include: {
        challengeStages: true,
      },
    });

    await tx.challenge.update({
      where: {
        id: newChallenge.id,
      },
      data: {
        currentStageId: newChallenge.challengeStages[0].id,
      },
    });
  });

  return { url: paymentResponse.link };
};

const OrderService = { placeOrder };
export default OrderService;
