import { z } from "zod";

export const contactSchema = z.object({
  office_department: z.string().min(1, "Office / Department is required"),
  contact_person: z.string().min(1, "Contact person name is required"),
  designation: z.string().optional().nullable(),
  phone_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number")
    .optional()
    .nullable()
    .or(z.literal("")),
  email_address: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .nullable()
    .or(z.literal("")),
  status: z.boolean().default(true),
});

export type ContactFormData = z.infer<typeof contactSchema>;
