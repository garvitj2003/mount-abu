import { z } from "zod";

export const complaintSchema = z.object({
  category_id: z.number({ required_error: "Please select a category" }).min(1, "Please select a category"),
  ward_id: z.number({ required_error: "Please select a ward" }).min(1, "Please select a ward"),
  location_address: z.string().min(5, "Please provide a more detailed location"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  applicant_name: z.string().min(2, "Applicant name is required"),
  applicant_mobile: z.string().length(10, "Mobile number must be 10 digits"),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;
