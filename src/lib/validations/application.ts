import { z } from "zod";


export const step1Schema = z.object({
  applicant_name: z.string().min(2, "Applicant name is required"),
  father_name: z.string().min(2, "Father's name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  current_address: z.string().min(5, "Current address is required"),
  property_address: z.string().min(5, "Property address is required"),
  type: z.enum(["NEW", "RENOVATION"] as const),
  work_description: z.string().min(10, "Please provide a more detailed description"),
  contractor_name: z.string().optional().nullable(),
  is_agriculture_land: z.boolean(),
  property_usage: z.enum(["DOMESTIC", "COMMERCIAL", "HOTEL"] as const),
  department_id: z.number({ message: "Please select a department" }).min(1, "Please select a department"),
  ward_id: z.number({ message: "Please select a ward/zone" }).min(1, "Please select a ward/zone"),
  title: z.string(),
});

export const materialRowSchema = z.object({
  material_id: z.number(),
  material_qty: z.number().min(1, "Quantity must be greater than 0"),
});

export const materialsSchema = z.array(materialRowSchema);
