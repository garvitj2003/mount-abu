"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  selectedValues: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  options: string[];
  isLoading: boolean;
  onSearchChange: (query: string) => void;
}

const Tag = ({ text, onRemove }: { text: string; onRemove: () => void }) => (
  <div className="flex items-center gap-1 rounded bg-[#E7F3FF] px-2 py-1 text-sm font-normal text-[#343434]">
    {text}
    <button onClick={onRemove} className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-blue-200">
      <Image src="/dashboard/icons/close.svg" alt="remove" width={10} height={10} className="opacity-60" />
    </button>
  </div>
);

export default function SearchableSelect({
  label,
  placeholder,
  selectedValues,
  onAdd,
  onRemove,
  options,
  isLoading,
  onSearchChange,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableOptions = options.filter(opt => !selectedValues.includes(opt));

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="text-sm font-medium text-[#343434]">{label}</label>
      <div className="relative min-h-[38px] w-full flex flex-wrap gap-2 rounded-lg border border-[#D6D9DE] bg-white px-2 py-1.5 pr-8 transition-all">
        {selectedValues.map((val) => (
          <Tag key={val} text={val} onRemove={() => onRemove(val)} />
        ))}
        <input
          type="text"
          placeholder={selectedValues.length === 0 ? placeholder : ""}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearchChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-[#343434] outline-none placeholder:text-gray-400"
        />
        <div className="absolute right-3 top-[11px] pointer-events-none">
           <Image 
             src="/dashboard/icons/applications/chevron-down.svg" 
             alt="down" 
             width={10} 
             height={6} 
             className={`opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`} 
           />
        </div>

        <AnimatePresence>
          {isOpen && (query.length > 0 || availableOptions.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 z-50 mt-[34px] max-h-[200px] overflow-y-auto rounded-lg border border-[#D6D9DE] bg-white shadow-lg"
            >
              {isLoading ? (
                <div className="px-4 py-2 text-xs text-gray-500">Searching...</div>
              ) : availableOptions.length > 0 ? (
                availableOptions.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onAdd(option);
                      setQuery("");
                      onSearchChange("");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-[#343434]"
                  >
                    {option}
                  </button>
                ))
              ) : query.length > 0 ? (
                <div className="px-4 py-2 text-xs text-gray-500">No results found</div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
