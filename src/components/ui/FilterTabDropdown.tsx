"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ApplicationFlag } from "@/constants/filters";

interface Option {
  label: string;
  value: ApplicationFlag;
}

interface FilterTabDropdownProps {
  label: string; // "New Construction" or "Renovation"
  options: Option[];
  selectedFlag: ApplicationFlag | "ALL";
  category: "New" | "Renovation";
  currentCategory: "New" | "Renovation" | "All";
  onSelect: (flag: ApplicationFlag) => void;
}

export default function FilterTabDropdown({
  label,
  options,
  selectedFlag,
  category,
  currentCategory,
  onSelect,
}: FilterTabDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isSelected = currentCategory === category;
  const selectedOption = options.find((opt) => opt.value === selectedFlag);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative h-[38px] w-[200px]" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-full w-full items-center justify-between rounded-lg border transition-all duration-200 outline-none focus:outline-none ${
          isSelected
            ? "bg-[#E7F3FF] border-[#0C83FF] text-[#0C83FF] px-3"
            : "bg-white border-[#D6D9DE] text-[#343434] hover:bg-gray-50 px-4"
        }`}
      >
        <div className="flex h-full flex-col justify-center items-start overflow-hidden text-left flex-1">
          <span
            className={`truncate w-full font-medium leading-none transition-all duration-200 ${
              isSelected ? "text-[11px] mb-0.5" : "text-sm"
            }`}
          >
            {label}
          </span>
          {isSelected && selectedOption && (
            <span className="truncate w-full text-[10px] opacity-80 leading-none">
              {selectedOption.label}
            </span>
          )}
        </div>

        <div
          className={`pointer-events-none transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <Image
            src="/dashboard/icons/applications/chevron-down.svg"
            alt="down"
            width={10}
            height={6}
            className={
              isSelected
                ? "brightness-0 invert-[.3] sepia-[1] saturate-[50] hue-rotate-[190deg]"
                : "opacity-60"
            }
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 flex max-h-[240px] flex-col overflow-y-auto rounded-lg border border-[#D6D9DE] bg-white p-1 shadow-[0px_6px_12px_0px_rgba(0,0,0,0.15)] focus:outline-none 
            [&::-webkit-scrollbar]:w-[3px] 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-[#D6D9DE] 
            [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 shrink-0 ${
                  isSelected && selectedFlag === option.value
                    ? "bg-[#E7F3FF] text-[#0C83FF] font-medium"
                    : "text-[#343434] font-normal"
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
