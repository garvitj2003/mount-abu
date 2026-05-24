"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import SearchableSelect from "./SearchableSelect";
import { useTokenSuggestions, useVehicleSuggestions, useMaterialSuggestions } from "@/hooks/useSuggestions";
import { useDebounce } from "@/hooks/useDebounce";

interface VehicleFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    token_number?: string[];
    vehicle_number?: string[];
    material_name?: string[];
    start_date?: string;
    end_date?: string;
  };
  onApply: (filters: {
    token_number?: string[];
    vehicle_number?: string[];
    material_name?: string[];
    start_date?: string;
    end_date?: string;
  }) => void;
  tokenOptions?: string[];
  vehicleOptions?: string[];
  materialOptions?: string[];
}

export default function VehicleFilterDrawer({
  isOpen,
  onClose,
  filters,
  onApply,
  tokenOptions: propTokenOptions,
  vehicleOptions: propVehicleOptions,
  materialOptions: propMaterialOptions,
}: VehicleFilterDrawerProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [tokenSearch, setTokenSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");

  const debouncedTokenSearch = useDebounce(tokenSearch, 500);
  const debouncedVehicleSearch = useDebounce(vehicleSearch, 500);
  const debouncedMaterialSearch = useDebounce(materialSearch, 500);

  const { data: apiTokenOptions = [], isLoading: isTokensLoading } = useTokenSuggestions(debouncedTokenSearch, { enabled: !propTokenOptions });
  const { data: apiVehicleOptions = [], isLoading: isVehiclesLoading } = useVehicleSuggestions(debouncedVehicleSearch, { enabled: !propVehicleOptions });
  const { data: apiMaterialOptions = [], isLoading: isMaterialsLoading } = useMaterialSuggestions(debouncedMaterialSearch, { enabled: !propMaterialOptions });

  const finalTokenOptions = propTokenOptions 
    ? propTokenOptions.filter(o => o.toLowerCase().includes(tokenSearch.toLowerCase())) 
    : apiTokenOptions;
    
  const finalVehicleOptions = propVehicleOptions 
    ? propVehicleOptions.filter(o => o.toLowerCase().includes(vehicleSearch.toLowerCase())) 
    : apiVehicleOptions;
    
  const finalMaterialOptions = propMaterialOptions 
    ? propMaterialOptions.filter(o => o.toLowerCase().includes(materialSearch.toLowerCase())) 
    : apiMaterialOptions;

  const isLocalMode = !!(propVehicleOptions || propMaterialOptions);

  // Sync local state when filters prop changes or drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared = {
      token_number: [],
      vehicle_number: [],
      material_name: [],
      start_date: "",
      end_date: "",
    };
    setLocalFilters(cleared);
    setTokenSearch("");
    setVehicleSearch("");
    setMaterialSearch("");
    onApply(cleared);
    onClose();
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
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F5F6F7] px-6 py-4">
              <h2 className="text-[15px] font-medium text-[#343434]">
                Vehicle Records Filter
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              >
                <Image
                  src="/dashboard/icons/close.svg"
                  alt="Close"
                  width={18}
                  height={18}
                />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Token Number - Hide in local mode (Token Detail view) */}
              {!isLocalMode && (
                <SearchableSelect
                  label="Token Number"
                  placeholder="Select Token Number"
                  selectedValues={localFilters.token_number || []}
                  onAdd={(val) => setLocalFilters(prev => ({ 
                    ...prev, 
                    token_number: [...(prev.token_number || []), val] 
                  }))}
                  onRemove={(val) => setLocalFilters(prev => ({ 
                    ...prev, 
                    token_number: (prev.token_number || []).filter(x => x !== val) 
                  }))}
                  onSearchChange={setTokenSearch}
                  options={finalTokenOptions}
                  isLoading={isTokensLoading && !propTokenOptions}
                />
              )}

              {/* Vehicle Number */}
              <SearchableSelect
                label="Vehicle Number"
                placeholder="Select Vehicle Number"
                selectedValues={localFilters.vehicle_number || []}
                onAdd={(val) => setLocalFilters(prev => ({ 
                  ...prev, 
                  vehicle_number: [...(prev.vehicle_number || []), val] 
                }))}
                onRemove={(val) => setLocalFilters(prev => ({ 
                  ...prev, 
                  vehicle_number: (prev.vehicle_number || []).filter(x => x !== val) 
                }))}
                onSearchChange={setVehicleSearch}
                options={finalVehicleOptions}
                isLoading={isVehiclesLoading && !propVehicleOptions}
              />

              {/* Material Type */}
              <SearchableSelect
                label="Material Type"
                placeholder="Select Material Name"
                selectedValues={localFilters.material_name || []}
                onAdd={(val) => setLocalFilters(prev => ({ 
                  ...prev, 
                  material_name: [...(prev.material_name || []), val] 
                }))}
                onRemove={(val) => setLocalFilters(prev => ({ 
                  ...prev, 
                  material_name: (prev.material_name || []).filter(x => x !== val) 
                }))}
                onSearchChange={setMaterialSearch}
                options={finalMaterialOptions}
                isLoading={isMaterialsLoading && !propMaterialOptions}
              />

              {/* Dates */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">From Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={localFilters.start_date || ""}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full h-[38px] rounded-lg border border-[#D6D9DE] bg-white px-3 text-sm text-[#343434] outline-none"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium text-[#343434]">To Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={localFilters.end_date || ""}
                      onChange={(e) => setLocalFilters(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full h-[38px] rounded-lg border border-[#D6D9DE] bg-white px-3 text-sm text-[#343434] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#D6D9DE] p-4 bg-white mt-auto">
              <button 
                onClick={handleClear}
                className="h-[38px] rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-6 text-sm font-medium text-[#343434] hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={handleApply}
                className="h-[38px] rounded-lg bg-[#0C83FF] px-8 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
