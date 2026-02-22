"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { useApplicationStore } from "@/store/useApplicationStore";
import { ApplicationService } from "@/services/applicationService";
import { useWards, useDepartments, useMaterials } from "@/hooks/useMasterData";
import { step1Schema } from "@/lib/validations/application";
import { type components } from "@/types/api";

type WardResponse = components["schemas"]["WardResponse"];
type DepartmentResponse = components["schemas"]["DepartmentResponse"];

export default function NewApplicationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isPending: isUserLoading } = useUser();
  const { data: wards = [], isPending: isWardsLoading } = useWards();
  const { data: departments = [], isPending: isDeptsLoading } = useDepartments();
  const { data: dbMaterials = [], isPending: isMaterialsLoading } = useMaterials();

  const isMasterDataLoading = isUserLoading || isWardsLoading || isDeptsLoading || isMaterialsLoading;

  const { 
    formData, 
    updateFormData, 
    currentStep, 
    setCurrentStep,
    applicationId,
    setApplicationId 
  } = useApplicationStore();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resume Application Logic
  useEffect(() => {
    const resumeApplication = async () => {
      if (!applicationId) return;

      try {
        const app = await ApplicationService.getApplication(applicationId);
        
        // 1. Populate Form Data
        updateFormData({
          applicant_name: app.applicant_name,
          father_name: app.father_name,
          email: app.email || "",
          current_address: app.current_address,
          property_address: app.property_address,
          type: app.type as any, // Cast to enum
          work_description: app.work_description,
          contractor_name: app.contractor_name || "",
          is_agriculture_land: app.is_agriculture_land,
          property_usage: app.property_usage as any,
          department_id: app.department_id || 0,
          ward_id: app.ward_id || 0,
        });

        // 2. Populate Materials (Local State)
        if (dbMaterials.length > 0) {
          const mergedMaterials = dbMaterials.map((dm) => {
            const existing = app.materials?.find((am) => am.material_id === dm.id);
            return {
              id: dm.id,
              name: dm.name,
              unit: dm.unit,
              qty: existing ? existing.quantity.toString() : "",
            };
          });
          setMaterials(mergedMaterials);
        }

        // 3. Determine Step
        const requiredDocs = ["AADHAAR", "OWNERSHIP_DOCUMENTS", "PROPERTY_PHOTOS", "PERMISSION_DOCUMENTS"];
        const uploadedDocTypes = app.documents?.map(d => d.document_type) || [];
        const allDocsUploaded = requiredDocs.every(type => uploadedDocTypes.includes(type as any));
        
        const hasMaterials = app.materials && app.materials.length > 0;

        if (!allDocsUploaded) {
          setCurrentStep(2);
        } else if (!hasMaterials) {
          setCurrentStep(3);
        } else {
          setCurrentStep(4);
        }

      } catch (error) {
        console.error("Failed to resume application", error);
      }
    };

    if (applicationId && dbMaterials.length > 0) { // Wait for dbMaterials to be loaded to map correctly
        resumeApplication();
    }
  }, [applicationId, updateFormData, setCurrentStep, dbMaterials]);

  // Sync Mobile
  useEffect(() => {
    if (user?.mobile) {
      updateFormData({ email: formData.email || "" });
    }
  }, [user, updateFormData, formData.email]);

  // Form State Step 2 (Files)
  const [files, setFiles] = useState<{ [key: string]: File | File[] | null }>({
    aadharCard: null,
    ownershipDocument: null,
    propertyPhotos: [],
    permissionDocuments: null,
  });

  // Form State Step 3 (Materials)
  const [materials, setMaterials] = useState<{id: number, name: string, unit: string, qty: string}[]>([]);

  useEffect(() => {
    if (dbMaterials.length > 0 && materials.length === 0) {
      setMaterials(dbMaterials.map(m => ({
        id: m.id,
        name: m.name,
        unit: m.unit,
        qty: ""
      })));
    }
  }, [dbMaterials, materials.length]);

  const [extraMaterials, setExtraMaterials] = useState<
    { id: number; name: string; unit: string; qty: string }[]
  >([]);

  const [pendingExtra, setPendingExtra] = useState({ name: "", unit: "Kg", qty: "" });
  const [agreed, setAgreed] = useState(false);

  const steps = [
    { id: 1, name: "Applicant name", icon: "/dashboard/icons/applications/step-applicant.svg" },
    { id: 2, name: "Upload Documents", icon: "/dashboard/icons/applications/step-upload.svg" },
    { id: 3, name: "Material Details", icon: "/dashboard/icons/applications/step-material.svg" },
    { id: 4, name: "Agree terms & make payment", icon: "/dashboard/icons/applications/step-payment.svg" },
  ];

  const handleSameAsCurrent = (checked: boolean) => {
    updateFormData({
      property_address: checked ? formData.current_address : "",
    });
  };

  const handleFileChange = (key: string, fileList: FileList | null) => {
    if (key === "propertyPhotos") {
      if (fileList) {
        setFiles((prev) => ({
          ...prev,
          [key]: [...(prev[key] as File[] || []), ...Array.from(fileList)],
        }));
      }
    } else {
      setFiles((prev) => ({ ...prev, [key]: fileList ? fileList[0] : null }));
    }
  };

  const removePhoto = (index: number) => {
    setFiles((prev) => ({
      ...prev,
      propertyPhotos: (prev.propertyPhotos as File[]).filter((_, i) => i !== index),
    }));
  };

  const handleMaterialQtyChange = (id: number, qty: string) => {
    setMaterials(materials.map((m) => (m.id === id ? { ...m, qty } : m)));
  };

  const addExtraMaterial = () => {
    if (!pendingExtra.name || !pendingExtra.qty) return;
    setExtraMaterials([...extraMaterials, { id: Date.now(), ...pendingExtra }]);
    setPendingExtra({ name: "", unit: "Kg", qty: "" });
  };

  const removeExtraMaterial = (id: number) => {
    setExtraMaterials(extraMaterials.filter((m) => m.id !== id));
  };

  const onNextStep1 = async () => {
    setErrors({});
    const validation = step1Schema.safeParse(formData);
    
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      
      Object.entries(fieldErrors).forEach(([key, messages]) => {
        if (messages && messages.length > 0) {
          newErrors[key] = messages[0];
        }
      });
      
      setErrors(newErrors);
      return;
    }

    try {
      if (applicationId) {
        setCurrentStep(2);
        return;
      }
      const response = await ApplicationService.createApplication({
        ...formData,
        material_requirements: []
      });
      setApplicationId(response.id);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setCurrentStep(2);
    } catch (error) {
      console.error("Step 1 Submission Failed", error);
      alert("Failed to save application details.");
    }
  };

  const onNextStep2 = async () => {
    if (!applicationId) return;
    try {
      setUploading(true);
      const docTypes = [
        { key: "aadharCard", type: "AADHAAR" },
        { key: "ownershipDocument", type: "OWNERSHIP_DOCUMENTS" },
        { key: "propertyPhotos", type: "PROPERTY_PHOTOS" },
        { key: "permissionDocuments", type: "PERMISSION_DOCUMENTS" },
      ];
      
      let completed = 0;
      let totalFiles = 0;
      
      // Calculate total files
      docTypes.forEach(doc => {
        if (doc.key === "propertyPhotos") {
          totalFiles += (files[doc.key] as File[])?.length || 0;
        } else if (files[doc.key]) {
          totalFiles += 1;
        }
      });

      for (const doc of docTypes) {
        if (doc.key === "propertyPhotos") {
          const photos = files[doc.key] as File[];
          if (photos && photos.length > 0) {
            for (const photo of photos) {
              await ApplicationService.uploadDocument(applicationId, photo, doc.type);
              completed++;
              setUploadProgress(Math.round((completed / totalFiles) * 100));
            }
          }
        } else {
          const file = files[doc.key] as File;
          if (file) {
            await ApplicationService.uploadDocument(applicationId, file, doc.type);
            completed++;
            setUploadProgress(Math.round((completed / totalFiles) * 100));
          }
        }
      }
      setCurrentStep(3);
    } catch (error) {
      console.error("File upload failed", error);
      alert("Failed to upload documents.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const onNextStep3 = async () => {
    if (!applicationId) return;
    try {
      const requirements: any[] = [];
      materials.forEach(m => {
        if (m.qty && !isNaN(Number(m.qty))) {
          requirements.push({ material_id: m.id, material_qty: Number(m.qty) });
        }
      });
      if (requirements.length === 0) {
        alert("Please enter at least one material quantity.");
        return;
      }
      await ApplicationService.addMaterials(applicationId, requirements);
      setCurrentStep(4);
    } catch (error) {
      console.error("Material submission failed", error);
      alert("Failed to save materials.");
    }
  };

  const onSubmitFinal = async () => {
    if (!applicationId || !agreed) return;
    try {
      await ApplicationService.submitApplication(applicationId);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      router.push("/citizen/applications");
    } catch (error) {
      console.error("Final submission failed", error);
      const message = (error as any)?.response?.data?.detail || "Final submission failed.";
      alert(message);
    }
  };

  const onSaveDraft = async () => {
    try {
      if (currentStep === 1) {
        const validation = step1Schema.safeParse(formData);
        if (!validation.success) {
          alert("Please fill required fields before saving draft.");
          return;
        }
        if (!applicationId) {
          const response = await ApplicationService.createApplication({
            ...formData,
            material_requirements: []
          });
          setApplicationId(response.id);
          queryClient.invalidateQueries({ queryKey: ["applications"] });
        }
      }
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Save draft failed", error);
      alert("Failed to save draft.");
    }
  };

  const renderStep1 = () => (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-5">
          <label className="w-[228px] text-[12px] font-normal text-[#343434] font-onest">Applicant name (As per aadhar only)</label>
          <input type="text" placeholder="Enter your name" className={`h-[34px] w-[313px] rounded-lg border ${errors.applicant_name ? "border-red-500" : "border-[#D6D9DE]"} px-3 text-sm text-[#343434] outline-none placeholder:opacity-30 focus:border-[#0C83FF] font-onest`} value={formData.applicant_name} onChange={(e) => updateFormData({ applicant_name: e.target.value })} />
        </div>
        {errors.applicant_name && <p className="ml-[248px] text-[10px] text-red-500">{errors.applicant_name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-5">
          <label className="w-[228px] text-[12px] font-normal text-[#343434] font-onest">Farher’s name (As per aadhar only)</label>
          <input type="text" placeholder="Enter your father name" className={`h-[34px] w-[313px] rounded-lg border ${errors.father_name ? "border-red-500" : "border-[#D6D9DE]"} px-3 text-sm text-[#343434] outline-none placeholder:opacity-30 focus:border-[#0C83FF] font-onest`} value={formData.father_name} onChange={(e) => updateFormData({ father_name: e.target.value })} />
        </div>
        {errors.father_name && <p className="ml-[248px] text-[10px] text-red-500">{errors.father_name}</p>}
      </div>

      <div className="flex items-center gap-5">
        <label className="w-[228px] text-[12px] font-normal text-[#343434] font-onest">Mobile Number</label>
        <div className="flex h-[34px] w-[313px] items-center rounded-lg border border-[#D6D9DE] bg-[#F0F0F0] px-3 text-sm text-[#343434] font-onest">+91-{user?.mobile || "8746574328"}</div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-5">
          <label className="w-[228px] text-[12px] font-normal text-[#343434] font-onest">Email address</label>
          <input type="email" placeholder="Enter your email" className={`h-[34px] w-[313px] rounded-lg border ${errors.email ? "border-red-500" : "border-[#D6D9DE]"} px-3 text-sm text-[#343434] outline-none placeholder:opacity-30 focus:border-[#0C83FF] font-onest`} value={formData.email || ""} onChange={(e) => updateFormData({ email: e.target.value })} />
        </div>
        {errors.email && <p className="ml-[248px] text-[10px] text-red-500">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-5">
          <label className="mt-1 w-[228px] text-[12px] font-normal text-[#343434] font-onest">Current Address</label>
          <textarea placeholder="Enter Current Address" className={`h-[84px] w-[313px] resize-none rounded-lg border ${errors.current_address ? "border-red-500" : "border-[#D6D9DE]"} p-3 text-sm text-[#343434] outline-none placeholder:opacity-30 focus:border-[#0C83FF] font-onest`} value={formData.current_address} onChange={(e) => updateFormData({ current_address: e.target.value })} />
        </div>
        {errors.current_address && <p className="ml-[248px] text-[10px] text-red-500">{errors.current_address}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-5">
          <label className="mt-1 w-[228px] text-[12px] font-normal text-[#343434] font-onest">New Construction address</label>
          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" className="hidden" checked={formData.property_address === formData.current_address && formData.current_address !== ""} onChange={(e) => handleSameAsCurrent(e.target.checked)} />
              <div className="flex h-5 w-5 items-center justify-center">
                <Image src={formData.property_address === formData.current_address && formData.current_address !== "" ? "/dashboard/icons/applications/radio-selected.svg" : "/dashboard/icons/applications/checkbox-uncheck.svg"} alt="checkbox" width={20} height={20} />
              </div>
              <span className="text-sm text-black font-onest font-normal">Same as current address.</span>
            </label>
            <textarea placeholder="Enter property address" className={`h-[84px] w-[313px] resize-none rounded-lg border ${errors.property_address ? "border-red-500" : "border-[#D6D9DE]"} p-3 text-sm text-[#343434] outline-none placeholder:opacity-30 focus:border-[#0C83FF] font-onest`} value={formData.property_address} onChange={(e) => updateFormData({ property_address: e.target.value })} />
          </div>
        </div>
        {errors.property_address && <p className="ml-[248px] text-[10px] text-red-500">{errors.property_address}</p>}
      </div>

      <div className="flex items-center gap-5">
        <label className="w-[228px] text-[12px] font-normal text-[#343434] font-onest">Type of work</label>
        <div className="flex items-center gap-5 py-1">
          {["RENOVATION", "NEW"].map((type) => (
            <label key={type} className="flex cursor-pointer items-center gap-1">
              <input type="radio" className="hidden" checked={formData.type === type} onChange={() => updateFormData({ type: type as any })} />
              <div className="flex h-5 w-5 items-center justify-center">
                <Image src={formData.type === type ? "/dashboard/icons/applications/radio-selected.svg" : "/dashboard/icons/applications/radio-unselected.svg"} alt="radio" width={20} height={20} />
              </div>
              <span className="text-sm text-black font-onest font-normal capitalize">{type.toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-5">
          <label className="mt-1 w-[228px] text-[12px] font-normal text-[#343434] font-onest">Work description</label>
          <textarea placeholder="Describe the work" className={`h-[97px] w-[313px] resize-none rounded-lg border ${errors.work_description ? "border-red-500" : "border-[#D6D9DE]"} p-3 text-sm text-[#343434] outline-none placeholder:opacity-30 focus:border-[#0C83FF] font-onest`} value={formData.work_description} onChange={(e) => updateFormData({ work_description: e.target.value })} />
        </div>
        {errors.work_description && <p className="ml-[248px] text-[10px] text-red-500">{errors.work_description}</p>}
      </div>

      <div className="flex items-center gap-5">
        <label className="w-[228px] text-[12px] font-normal text-[#343434] font-onest">Contractor name</label>
        <input type="text" placeholder="Enter contractor name" className="h-[34px] w-[313px] rounded-lg border border-[#D6D9DE] px-3 text-sm text-[#343434] outline-none placeholder:opacity-30 focus:border-[#0C83FF] font-onest" value={formData.contractor_name || ""} onChange={(e) => updateFormData({ contractor_name: e.target.value })} />
      </div>

      <div className="flex items-center gap-5">
        <label className="w-[228px] text-[12px] font-normal text-[#343434] font-onest">Is this property on agriculture land?</label>
        <div className="flex w-[315px] items-center gap-10 py-1">
          {[true, false].map((option) => (
            <label key={option ? "yes" : "no"} className="flex cursor-pointer items-center gap-1">
              <input type="radio" className="hidden" checked={formData.is_agriculture_land === option} onChange={() => updateFormData({ is_agriculture_land: option })} />
              <div className="flex h-5 w-5 items-center justify-center">
                <Image src={formData.is_agriculture_land === option ? "/dashboard/icons/applications/radio-selected.svg" : "/dashboard/icons/applications/radio-unselected.svg"} alt="radio" width={20} height={20} />
              </div>
              <span className="text-sm text-black font-onest font-normal uppercase">{option ? "YES" : "NO"}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <label className="w-[228px] text-[12px] font-normal text-[#343434] font-onest">Property usage</label>
        <div className="flex w-[315px] items-center gap-5 py-1">
          {["DOMESTIC", "COMMERCIAL", "HOTEL"].map((usage) => (
            <label key={usage} className="flex cursor-pointer items-center gap-1">
              <input type="radio" className="hidden" checked={formData.property_usage === usage} onChange={() => updateFormData({ property_usage: usage as any })} />
              <div className="flex h-5 w-5 items-center justify-center">
                <Image src={formData.property_usage === usage ? "/dashboard/icons/applications/radio-selected.svg" : "/dashboard/icons/applications/radio-unselected.svg"} alt="radio" width={20} height={20} />
              </div>
              <span className="text-sm text-black font-onest font-normal capitalize">{usage.toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-5">
          <label className="w-[228px] text-[12px] font-normal text-[#343434] font-onest">Select Department</label>
          <div className="relative h-[34px] w-[313px]">
            <select className={`h-full w-full appearance-none rounded-lg border ${errors.department_id ? "border-red-500" : "border-[#D6D9DE]"} bg-white px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] font-onest`} value={formData.department_id || ""} onChange={(e) => updateFormData({ department_id: Number(e.target.value) })}>
              <option value="">Select Department</option>
              {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"><Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} /></div>
          </div>
        </div>
        {errors.department_id && <p className="ml-[248px] text-[10px] text-red-500">{errors.department_id}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-5">
          <label className="w-[228px] text-[12px] font-normal text-[#343434] font-onest">Select Ward/Zone</label>
          <div className="relative h-[34px] w-[313px]">
            <select className={`h-full w-full appearance-none rounded-lg border ${errors.ward_id ? "border-red-500" : "border-[#D6D9DE]"} bg-white px-3 text-sm text-[#343434] outline-none focus:border-[#0C83FF] font-onest`} value={formData.ward_id || ""} onChange={(e) => updateFormData({ ward_id: Number(e.target.value) })}>
              <option value="">Select Ward</option>
              {wards.map(ward => <option key={ward.id} value={ward.id}>{ward.name}</option>)}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"><Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={10} height={6} /></div>
          </div>
        </div>
        {errors.ward_id && <p className="ml-[248px] text-[10px] text-red-500">{errors.ward_id}</p>}
      </div>

      <div className="flex items-center gap-5 pt-5">
        <div className="w-[228px]" />
        <button onClick={onNextStep1} className="flex items-center justify-center gap-2 rounded-lg bg-[#0C83FF] px-6 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors font-onest">Next <Image src="/dashboard/icons/applications/step-arrow.svg" alt="next" width={14} height={14} className="invert brightness-0" /></button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const uploadFields = [
      { key: "aadharCard", label: "Aadhar Card", hint: "PDF Only", accept: ".pdf" },
      { key: "ownershipDocument", label: "Ownership Document", hint: "PDF Only", accept: ".pdf" },
      { key: "propertyPhotos", label: "Property Photos", hint: "JPEG, PNG formats.", accept: ".jpg,.jpeg,.png", multiple: true },
      { key: "permissionDocuments", label: "Permission Documents", hint: "PDF Only", accept: ".pdf" },
    ];
    return (
      <div className="space-y-5">
        {uploading && (
          <div className="flex flex-col gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between text-sm font-medium text-blue-700 font-onest"><span>Uploading Documents...</span><span>{uploadProgress}%</span></div>
            <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} /></div>
          </div>
        )}
        {uploadFields.map((field) => (
          <div key={field.key} className="flex gap-5">
            <label className="w-[228px] text-[12px] font-normal text-[#343434] leading-tight font-onest">{field.label}</label>
            <div className="flex items-start gap-4">
              <div className="flex h-[138px] w-[321px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#D6D9DE] bg-white p-3">
                {(files[field.key] && !field.multiple) ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className="text-xs font-medium text-[#343434] truncate max-w-[200px] font-onest">{(files[field.key] as File).name}</span>
                    <button onClick={() => handleFileChange(field.key, null)} className="text-[10px] text-red-500 hover:underline font-onest">Remove</button>
                  </div>
                ) : (
                  <>
                    <Image src="/dashboard/icons/applications/upload-cloud.svg" alt="upload" width={36} height={36} />
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-normal text-black text-center leading-tight font-onest">Choose {field.multiple ? "files" : "a file"} or drag & drop.</p>
                      <p className="text-[12px] font-normal text-black opacity-60 font-onest">{field.hint}</p>
                    </div>
                    <label className="mt-1 flex cursor-pointer items-center justify-center rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2 text-sm font-normal text-[#343434] hover:bg-gray-200 transition-colors font-onest">
                      Browse File
                      <input 
                        type="file" 
                        className="hidden" 
                        accept={field.accept} 
                        multiple={field.multiple}
                        onChange={(e) => handleFileChange(field.key, e.target.files)} 
                      />
                    </label>
                  </>
                )}
              </div>
              
              {/* Preview List for Multiple Files (Property Photos) */}
              {field.multiple && (files[field.key] as File[])?.length > 0 && (
                <div className="flex flex-col gap-2 max-h-[138px] overflow-y-auto pr-1">
                  {(files[field.key] as File[]).map((file, index) => (
                    <div key={index} className="flex h-12 w-[200px] items-center gap-2 rounded border border-[#D6D9DE] bg-white p-1 pr-2 shrink-0">
                      <div className="h-10 w-10 relative bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {file.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-500">Doc</div>
                        )}
                      </div>
                      <span className="text-xs text-[#343434] truncate flex-1 font-onest">{file.name}</span>
                      <button onClick={() => removePhoto(index)} className="p-1 hover:bg-red-50 rounded">
                        <Image src="/dashboard/icons/close.svg" alt="remove" width={10} height={10} className="opacity-60 hover:opacity-100" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-5 pt-5">
          <div className="w-[228px]" />
          <div className="flex w-[321px] justify-between gap-5">
            <button onClick={() => setCurrentStep(1)} disabled={uploading} className="flex items-center justify-center gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-6 py-3 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors font-onest disabled:opacity-50">
              <Image src="/dashboard/icons/applications/arrow-back.svg" alt="back" width={14} height={14} /> Back
            </button>
            <button onClick={onNextStep2} disabled={uploading || (!files.aadharCard || !files.ownershipDocument || !files.permissionDocuments)} className="flex items-center justify-center gap-2 rounded-lg bg-[#0C83FF] px-6 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors font-onest disabled:opacity-50">
              {uploading ? "Uploading..." : "Next"} {!uploading && <Image src="/dashboard/icons/applications/step-arrow.svg" alt="next" width={14} height={14} className="invert brightness-0" />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const group1 = materials.slice(0, 5);
    const group2 = materials.slice(5);
    const MaterialTable = (items: typeof materials) => (
      <div className="flex flex-1 flex-row">
        <div className="flex flex-col flex-1">
          <div className="flex h-10 items-center justify-between border-b border-[#D6D9DE] pl-2 pr-0"><span className="text-[12px] font-semibold uppercase text-[#333333] opacity-70 font-onest">Material Name</span><div className="h-4 w-[1px] bg-black/10" /></div>
          {items.map((m) => (<div key={m.id} className="flex h-12 items-center border-b border-[#D6D9DE] px-2 bg-white"><span className="text-sm font-medium text-[#343434] font-onest">{m.name} ({m.unit})</span></div>))}
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex h-10 items-center justify-between border-b border-[#D6D9DE] pl-2 pr-0"><span className="text-[12px] font-semibold uppercase text-[#333333] opacity-70 font-onest">Estimated Material</span><div className="h-4 w-[1px] bg-black/10" /></div>
          {items.map((m) => (<div key={m.id} className="flex h-12 items-center border-b border-[#D6D9DE] px-2 bg-white"><div className="h-[34px] w-full rounded-lg border border-[#D6D9DE] bg-white px-3 flex items-center"><input type="text" className="w-full text-sm text-[#343434] outline-none font-onest" value={m.qty} onChange={(e) => handleMaterialQtyChange(m.id, e.target.value)} /></div></div>))}
        </div>
      </div>
    );
    return (
      <div className="space-y-10">
        <div className="flex w-full max-w-[805px] gap-5">{MaterialTable(group1)}{MaterialTable(group2)}</div>
        <div className="flex w-full max-w-[805px] flex-col gap-5">
          <div className="flex items-center justify-center gap-2.5 py-[7px]"><span className="text-sm font-medium text-[#343434] font-onest">Add Extra Materials</span><div className="h-px flex-1 bg-[#D6D9DE]" /></div>
          <div className="flex gap-2">
            <div className="flex-1 flex flex-row">
              <div className="flex flex-col flex-1">
                <div className="flex h-10 items-center justify-between border-b border-[#D6D9DE] pl-2 pr-0"><span className="text-[12px] font-semibold uppercase text-[#333333] opacity-70 font-onest">Material Name</span><div className="h-4 w-[1px] bg-black/10" /></div>
                <div className="flex h-12 items-center border-b border-[#D6D9DE] px-2 bg-white"><div className="h-[34px] w-full rounded-lg border border-[#D6D9DE] bg-white px-3 flex items-center"><input type="text" placeholder="Material name" className="w-full text-sm text-[#343434] outline-none placeholder:opacity-20 font-onest" value={pendingExtra.name} onChange={(e) => setPendingExtra({ ...pendingExtra, name: e.target.value })} /></div></div>
                {extraMaterials.map(m => (<div key={m.id} className="flex h-12 items-center border-b border-[#D6D9DE] px-2 bg-white"><span className="text-sm font-medium text-[#343434] font-onest pl-3">{m.name}</span></div>))}
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex h-10 items-center justify-between border-b border-[#D6D9DE] pl-2 pr-0"><span className="text-[12px] font-semibold uppercase text-[#333333] opacity-70 font-onest">Estimated Material</span><div className="h-4 w-[1px] bg-black/10" /></div>
                <div className="flex h-12 items-center border-b border-[#D6D9DE] px-2 bg-white"><div className="flex h-[34px] w-full items-center justify-between rounded-lg border border-[#D6D9DE] bg-white px-3"><input type="text" placeholder="Enter Qty" className="w-full text-sm text-[#343434] outline-none placeholder:opacity-20 font-onest" value={pendingExtra.qty} onChange={(e) => setPendingExtra({ ...pendingExtra, qty: e.target.value })} /><div className="flex items-center gap-1 border-l border-[#D6D9DE] pl-2 ml-2"><select className="bg-transparent text-sm text-[#343434] outline-none font-onest" value={pendingExtra.unit} onChange={(e) => setPendingExtra({ ...pendingExtra, unit: e.target.value })}><option value="Kg">Kg</option><option value="Nos">Nos</option><option value="Bags">Bags</option></select><Image src="/dashboard/icons/applications/chevron-down.svg" alt="down" width={8} height={5} /></div></div></div>
                {extraMaterials.map(m => (<div key={m.id} className="flex h-12 items-center border-b border-[#D6D9DE] px-2 bg-white"><span className="text-sm font-medium text-[#343434] font-onest pl-3">{m.qty} {m.unit}</span></div>))}
              </div>
            </div>
            <div className="w-10 flex flex-col pt-10">
              <button onClick={addExtraMaterial} className="h-12 flex items-center justify-center text-[#0C83FF] hover:opacity-80 transition-opacity"><Image src="/dashboard/icons/applications/add-material.svg" alt="add" width={22} height={22} /></button>
              {extraMaterials.map(m => (<button key={m.id} onClick={() => removeExtraMaterial(m.id)} className="h-12 flex items-center justify-center text-[#EF4444] hover:opacity-80 transition-opacity"><Image src="/dashboard/icons/applications/remove-material.svg" alt="remove" width={22} height={22} /></button>))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5 pt-5"><div className="flex w-full max-w-[805px] justify-end gap-5">
          <button onClick={() => setCurrentStep(2)} className="flex items-center justify-center gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-6 py-3 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors font-onest font-medium"><Image src="/dashboard/icons/applications/arrow-back.svg" alt="back" width={14} height={14} /> Back</button>
          <button onClick={onNextStep3} className="flex items-center justify-center gap-2 rounded-lg bg-[#0C83FF] px-6 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors font-onest font-medium">Next <Image src="/dashboard/icons/applications/step-arrow.svg" alt="next" width={14} height={14} className="invert brightness-0" /></button>
        </div></div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-8 max-w-[805px]">
      <div className="flex flex-col gap-6">
        <label className="flex cursor-pointer items-center gap-2 group">
          <input type="checkbox" className="hidden" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <div className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${agreed ? "border-[#0C83FF] bg-[#0C83FF]" : "border-[#D6D9DE] group-hover:border-[#0C83FF]"}`}>{agreed && (<svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}</div>
          <span className="text-sm font-medium text-[#343434] font-onest">I agree to Below Mentioned agreement.</span>
        </label>
        <div className="space-y-4 text-[#343434] text-sm leading-relaxed pl-1 font-onest">
          <p className="font-bold">State: Rajasthan</p>
          <div className="space-y-3">
            <p><span className="font-bold">1. My name is {formData.applicant_name || "[Applicant Name]"}</span>, son of Shri {formData.father_name || "[Father's Name]"}.</p>
            <div className="space-y-1"><p><span className="font-bold">2. I am the owner of the property</span>, the address of which is:</p><p className="italic">{formData.property_address || "[Property Address]"}.</p><p>I have applied for permission for <span className="font-bold">transportation of construction materials.</span></p></div>
            <p><span className="font-bold">3. I declare that</span> if any construction material other than or in excess of the permitted quantity is transported or used, legal action may be taken, and illegal construction and encroachment may be demolished.</p>
            <p><span className="font-bold">4. I declare that</span> I will comply with all directions issued by the Hon&apos;ble National Green Tribunal (NGT) and the Hon&apos;ble Supreme Court and will keep the <span className="font-bold">Mount Abu Eco-Sensitive Zone</span> protected and safe.</p>
            <p><span className="font-bold">5. I declare that</span> I will ensure full compliance with the <span className="font-bold">Mount Abu Zonal Master Plan 2030</span> and the <span className="font-bold">Mount Abu Building Byelaws, 2019.</span></p>
            <p><span className="font-bold">6. I declare that</span> there is no case or dispute pending in any court regarding this property.</p>
          </div>
          <p className="pt-2 font-medium">Date: {new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}</p>
        </div>
      </div>
      <div className="flex items-center gap-5 pt-5 border-t border-[#D6D9DE]"><div className="flex w-full justify-end gap-5">
        <button onClick={() => setCurrentStep(3)} className="flex items-center justify-center gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-6 py-3 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors font-onest"><Image src="/dashboard/icons/applications/arrow-back.svg" alt="back" width={14} height={14} /> Back</button>
        <button disabled={!agreed} onClick={onSubmitFinal} className="flex items-center justify-center gap-2 rounded-lg bg-[#0C83FF] px-10 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors font-onest disabled:opacity-50 disabled:cursor-not-allowed">Submit</button>
      </div></div>
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative">
      {isMasterDataLoading && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
            <p className="text-sm font-medium text-[#343434]">Loading required data...</p>
          </div>
        </div>
      )}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3 shadow-sm font-onest">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100 transition-colors"><Image src="/dashboard/icons/applications/arrow-back.svg" alt="Back" width={16} height={16} /></button>
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-medium text-[#343434]">Create New Application</h1>
            <p className="text-xs font-normal text-[#343434] opacity-80">All your new construction and renovation applications go here.</p>
          </div>
        </div>
        <button onClick={onSaveDraft} className="rounded-lg cursor-pointer border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-3 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors">Save as draft</button>
      </div>
      <div className="flex flex-col p-5 overflow-y-auto">
        <div className="w-full rounded-lg border border-[#D6D9DE] bg-white p-5">
          <div className="mb-8 flex items-center gap-2.5">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2.5">
                <div className={`flex items-center gap-1 ${currentStep >= step.id ? "opacity-100" : "opacity-60"}`}>
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full ${currentStep >= step.id ? "bg-[#0C83FF]/10 text-[#0C83FF]" : "bg-gray-100 text-[#343434]"}`}><Image src={step.icon} alt={step.name} width={20} height={20} className={currentStep >= step.id ? "" : "grayscale opacity-50"} /></div>
                  <span className={`text-[12px] font-semibold ${currentStep >= step.id ? "text-[#0C83FF]" : "text-[#343434]"}`}>{step.name}</span>
                </div>
                {index < steps.length - 1 && <Image src="/dashboard/icons/applications/step-arrow.svg" alt="arrow" width={20} height={20} className={currentStep > step.id ? "opacity-100" : "opacity-60"} />}
              </div>
            ))}
          </div>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
}
