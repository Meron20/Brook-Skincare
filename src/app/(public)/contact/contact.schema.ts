import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  concern: z.string().min(1, "Please select your skin concern"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message cannot be more than 500 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;