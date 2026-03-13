import prisma from "../shared/prisma";

const phases = [
  {
    name: "phase 1",
    tradingPeriod: "30 days",
    leverage: "1:200",
    minTradingDays: 10,
    maxDailyLossRate: 5,
    maxOverallLossRate: 10,
    profitTargetRate: 8,
    holdOverWeekend: true,
    tradingEAS: true,
    newsTrading: false,
    profitShareRate: 80,
    firstPayoutDays: 30,
    isRequiredRegistrationFee: true,
    isRegistrationFeeRefund: true,
  },
  {
    name: "phase 2",
    tradingPeriod: "30 days",
    leverage: "1:200",
    minTradingDays: 10,
    maxDailyLossRate: 5,
    maxOverallLossRate: 10,
    profitTargetRate: 8,
    holdOverWeekend: true,
    tradingEAS: true,
    newsTrading: false,
    profitShareRate: 80,
    firstPayoutDays: 30,
    isRequiredRegistrationFee: true,
    isRegistrationFeeRefund: true,
  },
  {
    name: "funded trader",
    tradingPeriod: "30 days",
    leverage: "1:200",
    minTradingDays: 10,
    maxDailyLossRate: 5,
    maxOverallLossRate: 10,
    profitTargetRate: 8,
    holdOverWeekend: true,
    tradingEAS: true,
    newsTrading: false,
    profitShareRate: 80,
    firstPayoutDays: 30,
    isRequiredRegistrationFee: true,
    isRegistrationFeeRefund: true,
  },
];

export const createEvaluation = async () => {
  const createdPhases: Record<string, string> = {};

  // create / upsert phases
  for (const phase of phases) {
    const dbPhase = await prisma.phase.upsert({
      where: { name: phase.name },
      update: {},
      create: phase,
    });

    createdPhases[phase.name] = dbPhase.id;
  }

  // delete old evaluations
  await prisma.evaluation.deleteMany();

  const evaluations = [
    {
      code: "one_step",
      name: "1 step evaluation",
      phases: ["phase 1"],
    },
    {
      code: "two_step",
      name: "2 step evaluation",
      phases: ["phase 1", "phase 2"],
    },
    {
      code: "three_step",
      name: "3 step evaluation",
      phases: ["phase 1", "phase 2", "funded trader"],
    },
    {
      code: "instant_funding",
      name: "Instant funding",
      phases: ["funded trader"],
    },
  ];

  for (const evaluation of evaluations) {
    await prisma.evaluation.create({
      data: {
        code: evaluation.code,
        name: evaluation.name,

        evaluationPhases: {
          create: evaluation.phases.map((p, index) => ({
            phase: {
              connect: { id: createdPhases[p] },
            },
            order: index + 1,
          })),
        },
      },
    });
  }
};
