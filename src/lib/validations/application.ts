import { z } from "zod";


export const step1Schema = z.object({
  applicant_name: z.string().min(2, "Applicant name is required"),
  father_name: z.string().min(2, "Father's name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  current_address: z.string().min(5, "Current address is required"),
  property_address: z.string().min(5, "Property address is required"),
  type: z.enum(["NEW", "RENOVATION"] as const),
  is_emergency_repair: z.boolean().default(false),
  work_description: z.string().min(10, "Please provide a more detailed description"),
  contractor_name: z.string().optional().nullable(),
  is_agriculture_land: z.boolean(),
  property_usage: z.enum(["DOMESTIC", "COMMERCIAL", "GOVERNMENT"] as const),
  ward_id: z.number({ message: "Please select a ward/zone" }).min(1, "Please select a ward/zone"),
  title: z.string(),
  jurisdiction_zone: z.enum(["ULB", "UIT"] as const),
  existing_structure: z.enum(["NONE", "FENCING", "G", "G+1", "G+2", "G+3"] as const),
  construction_floor: z.enum(["NONE", "FENCING", "G", "G+1", "G+2", "G+3"] as const),
  organization_name: z.string().optional().nullable(),
}).refine((data) => {
  if (data.type === "NEW" && data.existing_structure === "G+3") {
    return false;
  }
  return true;
}, {
  message: "Application cannot be created if existing structure is G+3",
  path: ["existing_structure"],
}).refine((data) => {
  if (data.property_usage !== "DOMESTIC" && (!data.organization_name || !data.organization_name.trim())) {
    return false;
  }
  return true;
}, {
  message: "Organization name is required for commercial/government properties",
  path: ["organization_name"],
});
