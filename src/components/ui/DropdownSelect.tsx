"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface Option {
  label: string;
  value: string | number;
}

interface DropdownSelectProps {
  options: Option[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  renderTrigger?: (option: Option | undefined, isOpen: boolean) => React.ReactNode;
  triggerClassName?: string;
}

export default function DropdownSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className = "",
  disabled = false,
  renderTrigger,
  triggerClassName = "",
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

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
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex h-full w-full items-center justify-between rounded-lg border px-3 text-sm transition-colors focus:border-[#0C83FF] focus:outline-none disabled:bg-gray-50 disabled:opacity-60 ${
          isOpen ? "border-[#0C83FF]" : "border-[#D6D9DE]"
        } ${triggerClassName || "bg-white"}`}
      >
        {renderTrigger ? (
          renderTrigger(selectedOption, isOpen)
        ) : (
          <>
            <span className={`truncate font-normal ${selectedOption ? "text-[#343434]" : "text-[#343434] opacity-40"}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div className={`pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
              <Image
                src="/dashboard/icons/applications/chevron-down.svg"
                alt="down"
                width={10}
                height={6}
                className="opacity-60"
              />
            </div>
          </>
        )}
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
            {options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 shrink-0 ${
                    value === option.value ? "bg-[#E7F3FF] text-[#0C83FF] font-medium" : "text-[#343434] font-normal"
                  }`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400">No options</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
