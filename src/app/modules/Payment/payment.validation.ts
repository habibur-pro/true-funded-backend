import { z } from 'zod'

const createPaymentValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Payment name is required.' }),
  }),
})

export const PaymentValidation = {
  createPaymentValidationSchema,
}
