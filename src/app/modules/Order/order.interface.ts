import { TradePlatformType } from "@prisma/client";

export interface OrderPlacePayload {
  information: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    agreeToTerms: boolean;
  };
  pricing: {
    evaluation: string;
    platform: TradePlatformType;
    fundedAmount: number;
    subtotal: number;
    discount: number;
    discountCode?: string;
    total: number;
  };
}
