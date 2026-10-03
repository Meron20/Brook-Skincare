import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  concern: z.string().optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message cannot be more than 500 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;