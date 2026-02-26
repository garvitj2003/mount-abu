"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type components } from "@/types/api";

type ApplicationResponse = components["schemas"]["ApplicationResponse"];
type ApplicationDocumentResponse = components["schemas"]["ApplicationDocumentResponse"];

interface ApplicationMaterialsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  app: ApplicationResponse;
}

const isImage = (doc: ApplicationDocumentResponse) => {
  const imageTypes = ["APPLICANT_PHOTO", "PROPERTY_PHOTOS", "SITE_INSPECTION", "GEO_TAGGED_PHOTO"];
  if (imageTypes.includes(doc.document_type)) return true;
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.access_url || doc.document_path || "");
};

const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={`flex size-5 items-center justify-center rounded border transition-colors cursor-pointer ${
      checked ? "border-[#0C83FF] bg-[#0C83FF]" : "border-[#D6D9DE] bg-white"
    }`}
  >
    {checked && (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  </button>
);

export default function ApplicationMaterialsDrawer({
  isOpen,
  onClose,
  app,
}: ApplicationMaterialsDrawerProps) {
  const [selectedMaterials, setSelectedMaterials] = useState<Record<number, boolean>>({});
  const [extraQtys, setExtraQtys] = useState<Record<number, string>>({});

  const attachedDocs = useMemo(() => {
    const docs = app.documents?.filter((d) => d.document_type !== "GEO_TAGGED_PHOTO") || [];
    return [...docs].sort((a, b) => (isImage(a) === isImage(b) ? 0 : isImage(a) ? 1 : -1));
  }, [app.documents]);

  const geoTaggedDocs = useMemo(() => {
    return app.documents?.filter((d) => d.document_type === "GEO_TAGGED_PHOTO") || [];
  }, [app.documents]);

  const handleToggleMaterial = (id: number) => {
    setSelectedMaterials(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExtraQtyChange = (id: number, val: string) => {
    setExtraQtys(prev => ({ ...prev, [id]: val }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-xs"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative z-10 h-full w-full max-w-[480px] bg-white shadow-2xl font-onest flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F4F4F4] px-5 py-4">
              <h2 className="text-[14px] font-medium text-[#343434]">
                View Pictures & Material Details (APP-{app.id.toString().padStart(5, '0')})
              </h2>
              <button
                onClick={onClose}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              >
                <Image src="/dashboard/icons/close.svg" alt="Close" width={14} height={14} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Utilized Material Table */}
              <div className="space-y-3">
                <p className="px-3 text-[12px] font-medium text-[#498AA9] uppercase">Utilized Material</p>
                <div className="overflow-hidden rounded-lg border border-[#D6D9DE]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#D6D9DE] bg-white">
                        <th className="w-10 p-2 border-r border-[#D6D9DE]"></th>
                        <th className="p-2 text-[11px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Material Name</th>
                        <th className="p-2 text-[11px] font-semibold text-[#333333] opacity-70 uppercase border-r border-[#D6D9DE]">Utilized Qty</th>
                        <th className="p-2 text-[11px] font-semibold text-[#333333] opacity-70 uppercase">Extra Material Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {app.materials?.map((mat) => (
                        <tr key={mat.id} className="border-b border-[#D6D9DE] last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="p-2 text-center border-r border-[#D6D9DE]">
                            <Checkbox 
                              checked={!!selectedMaterials[mat.id]} 
                              onChange={() => handleToggleMaterial(mat.id)} 
                            />
                          </td>
                          <td className="p-2 text-[13px] font-medium text-[#343434] border-r border-[#D6D9DE]">
                            Material {mat.material_id}
                          </td>
                          <td className="p-2 text-[13px] font-medium text-[#343434] border-r border-[#D6D9DE]">
                            {mat.quantity} Units
                          </td>
                          <td className="p-2">
                            <input 
                              type="text" 
                              placeholder="-"
                              value={extraQtys[mat.id] || ""}
                              onChange={(e) => handleExtraQtyChange(mat.id, e.target.value)}
                              className="w-full rounded border border-[#D6D9DE] bg-white px-2 py-1 text-[12px] outline-none focus:border-[#0C83FF]"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Banner */}
                <div className="rounded-lg border border-[#B39632] bg-[#FFD648] p-3">
                  <p className="text-[10px] font-normal text-[#343434] leading-tight">
                    You can Request extra material if required. A new token will be generated for above materials.
                  </p>
                </div>

                {/* Action Button */}
                <button className="w-full rounded-lg bg-[#0C83FF] py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors cursor-pointer shadow-sm">
                  Request Extra Material
                </button>
              </div>

              {/* Attached Documents Grid */}
              <div className="space-y-3">
                <p className="px-3 text-[12px] font-medium text-[#498AA9] uppercase">Attached Documents</p>
                <div className="grid grid-cols-2 gap-3">
                  {attachedDocs.map((doc) => {
                    const isImg = isImage(doc);
                    return (
                      <div key={doc.id} className="flex flex-col gap-2 rounded-lg border border-[#D6D9DE] p-2 hover:border-[#0C83FF] transition-all group">
                        <div className="aspect-[1.6/1] relative rounded bg-[#F9FAFB] overflow-hidden flex items-center justify-center">
                          {isImg ? (
                            <Image src={doc.access_url || "/sample/application-main.png"} alt="" fill unoptimized className="object-cover" />
                          ) : (
                            <Image src="/dashboard/icons/applications.svg" alt="PDF" width={32} height={32} className="opacity-40" />
                          )}
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <p className="text-[10px] font-semibold text-[#343434] truncate max-w-[120px]">
                            {doc.document_type.replace(/_/g, ' ')}
                          </p>
                          <a href={doc.access_url || "#"} target="_blank" className="text-[10px] font-bold text-[#0C83FF] hover:underline">View</a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Geo-Tagged Pictures */}
              <div className="space-y-3">
                <p className="px-3 text-[12px] font-medium text-[#498AA9] uppercase">Geo-Tagged Pictures</p>
                <div className="grid grid-cols-2 gap-3">
                  {geoTaggedDocs.map((doc) => (
                    <div key={doc.id} className="aspect-square relative rounded-lg border border-[#D6D9DE] overflow-hidden bg-gray-100">
                       <Image src={doc.access_url || "/sample/application-main.png"} alt="Geo-tagged" fill unoptimized className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="border-t border-[#D6D9DE] p-4 bg-white flex justify-end">
              <button 
                onClick={onClose}
                className="rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-8 py-2.5 text-[14px] font-medium text-[#343434] hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
