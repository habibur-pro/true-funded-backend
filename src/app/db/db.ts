import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { User, UserGender, UserRole, UserStatus } from "@prisma/client";
import { createEvaluation } from "../../utils/evaluationCreator";

export const initiateSuperAdmin = async () => {
  const existAdmin = await prisma.user.findUnique({
    where: { email: "admin@gmail.com" },
  });

  if (!existAdmin) {
    await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "Application",
        email: "admin@gmail.com",
        phone: "1234567890",
        role: UserRole.ADMIN,
        password: await bcrypt.hash("12345678", 10),
        gender: UserGender.MALE,
        isEmailVerified: true,
        isKycVerified: true,
      },
    });
  }

  const evaluationCount = await prisma.evaluation.count();

  if (evaluationCount === 0) {
    await createEvaluation();
  }
};
