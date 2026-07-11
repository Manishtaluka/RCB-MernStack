import { z } from "zod";

export const shippingSchema = z.object({
  fullName: z.string().min(2, "Enter the recipient's name"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  addressLine: z.string().min(5, "Enter a complete address"),
  city: z.string().min(2, "Enter a city"),
  state: z.string().min(2, "Enter a state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});
