/* eslint-disable @typescript-eslint/no-explicit-any */

import { PaymentStatus, TradePlatformType } from "@prisma/client";

export type TItem = {
  name: string;
  image: string;
  price: number;
  quantity: number;
};
export type TWebhookPayload = {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: {
    object: TPaymentIntentObject;
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string;
    idempotency_key: string;
  };
  type: string;
};

export type TPaymentIntentObject = {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_details: {
    tip: any; // You can define a type for tip if needed
  };
  amount_received: number;
  application: string | null;
  application_fee_amount: number | null;
  automatic_payment_methods: any; // Define type if needed
  canceled_at: number | null;
  cancellation_reason: string | null;
  capture_method: string;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer: string;
  description: string | null;
  invoice: string | null;
  last_payment_error: string | null;
  latest_charge: string;
  livemode: boolean;
  metadata: {
    platform: TradePlatformType;
    user_id: string;
    founded_amount: any; // Assuming founded_amount is a string
    evaluation: string;
  };
  next_action: any; // Define type if needed
  on_behalf_of: string | null;
  payment_method: string;
  payment_method_configuration_details: any; // Define type if needed
  payment_method_options: {
    card: {
      installments: any; // Define type if needed
      mandate_options: any; // Define type if needed
      network: any; // Define type if needed
      request_three_d_secure: string;
    };
  };
  payment_method_types: string[];
  processing: any; // Define type if needed
  receipt_email: string;
  review: any; // Define type if needed
  setup_future_usage: string | null;
  shipping: any; // Define type if needed
  source: any; // Define type if needed
  statement_descriptor: string | null;
  statement_descriptor_suffix: string | null;
  status: string;
  transfer_data: any; // Define type if needed
  transfer_group: string | null;
};

export type TCryptoInvoicePayload = {
  amount: number;
  currency: string;
  add_fields: Array<{
    founded_amount: number;
    evaluation: string;
    userId: string;
  }>;
  order_id?: string;
  email?: string;
};

export type TCryptoWebhookInvoice = {
  uuid: string;
  created: string;
  address: string;
  currency: string;
  date_finished: string | null;
  expiry_date: string;
  side_commission: number;
  type_payments: string;
  amount: number;
  amount_: number;
  status: string;
  invoice_status: string;
  is_email_required: boolean;
  project: string;
  tx_list: string[];
  amount_in_crypto: number;
  amount_in_fiat: number;
  amount_usd: number;
  amount_to_pay: number;
  amount_to_pay_usd: number;
  amount_paid: number;
  amount_paid_usd: number;
  fee: number;
  fee_usd: number;
  service_fee: number;
  service_fee_usd: number;
  received: number;
  received_usd: number;
  to_surcharge: number;
  to_surcharge_usd: number;
  total_rub: number;
  step: string;
  test_mode: boolean;
  type: string;
  aml_enabled: boolean;
  aml_side: string;
  aml_checks: string[];
  links_invoice: string[];
};

export type TCryptoWebhookPayload = {
  status: string;
  invoice_id: string;
  amount_crypto: number;
  currency: string;
  order_id: string;
  token: string;
  invoice_info: TCryptoWebhookInvoice[];
};

// invoice data

export type TNetwork = {
  code: string;
  id: number;
  icon: string;
  fullname: string;
};

export type TCurrency = {
  id: number;
  code: string;
  fullcode: string;
  network: TNetwork;
  name: string;
  is_email_required: boolean;
  stablecoin: boolean;
  icon_base: string;
  icon_network: string;
  icon_qr: string;
  order: number;
};

export type TCryptoInvoiceProject = {
  id: number;
  name: string;
  fail: string;
  success: string;
  logo: string;
};

export type TCryptoInvoiceResult = {
  uuid: string;
  created: string;
  address: string;
  currency: TCurrency;
  date_finished: string | null;
  expiry_date: string;
  side_commission: string;
  side_commission_cc: string;
  type_payments: string;
  status: string;
  invoice_status: string;
  is_email_required: boolean;
  project: TCryptoInvoiceProject;
  tx_list: any[];
  test_mode: boolean;
  type: string;
  user_email: string;
  pay_url: string | null;
  phone: string;
  order_id: string;
  amount_in_crypto: number | null;
  amount_in_fiat: number;
  amount: number;
  amount_usd: number;
  amount_to_pay: number;
  amount_to_pay_usd: number;
  amount_paid: number;
  amount_paid_usd: number;
  fee: number;
  fee_usd: number;
  service_fee: number;
  service_fee_usd: number;
  received: number;
  received_usd: number;
  to_surcharge: number;
  to_surcharge_usd: number;
};

export type TCryptoInvoice = {
  status: string;
  result: TCryptoInvoiceResult[];
};
