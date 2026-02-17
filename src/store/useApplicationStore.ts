import { create } from "zustand";
import { z } from "zod";
import { step1Schema } from "@/lib/validations/application";

export type ApplicationFormData = z.infer<typeof step1Schema>;

interface MaterialItem {
  material_id: number;
  material_qty: number;
}

interface ApplicationState {
  applicationId: number | null;
  currentStep: number;
  formData: ApplicationFormData;
  materials: MaterialItem[];
  
  // Actions
  setApplicationId: (id: number | null) => void;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<ApplicationFormData>) => void;
  setMaterials: (materials: MaterialItem[]) => void;
  resetApplication: () => void;
}

const initialFormData: ApplicationFormData = {
  applicant_name: "",
  father_name: "",
  email: "",
  current_address: "",
  property_address: "",
  type: "RENOVATION",
  work_description: "",
  contractor_name: "",
  is_agriculture_land: false,
  property_usage: "DOMESTIC",
  department_id: 0,
  ward_id: 0,
  title: "Construction/Renovation Permit Request",
};

export const useApplicationStore = create<ApplicationState>((set) => ({
  applicationId: null,
  currentStep: 1,
  formData: initialFormData,
  materials: [],

  setApplicationId: (id) => set({ applicationId: id }),
  setCurrentStep: (step) => set({ currentStep: step }),
  updateFormData: (data) => 
    set((state) => ({ 
      formData: { ...state.formData, ...data } 
    })),
  setMaterials: (materials) => set({ materials }),
  resetApplication: () => set({ 
    applicationId: null, 
    currentStep: 1, 
    formData: initialFormData,
    materials: []
  }),
}));
