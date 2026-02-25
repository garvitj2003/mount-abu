"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useApplicationComments, useAddComment } from "@/hooks/useApplications";
import { type components } from "@/types/api";

type CommentResponse = components["schemas"]["backend__schemas__response__application__CommentResponse"];

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number;
  applicationNumber: string;
  isObjectionMode?: boolean;
  onObjectionSubmit?: (remarks: string) => Promise<void>;
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Just now";
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date(dateString));
};

const CommentCard = ({ comment }: { comment: CommentResponse }) => {
  // Determine styles based on comment type or commenter (simplified for now)
  let bgColor = "bg-[#F5F6F7]";
  let titleColor = "text-[#343434]";
  const isObjection = comment.comment_type === "GENERAL" && comment.comment.toLowerCase().includes("objection"); // Mock logic for objection badge

  if (comment.comment_type === "DEPT_REVIEW") {
    bgColor = "bg-[#E6F7F5]"; // Light green for Dept
    titleColor = "text-[#008080]";
  } else if (isObjection) {
    bgColor = "bg-[#FFF1F0]"; // Light red for Objection
    titleColor = "text-[#CF1322]";
  } else if (comment.comment_type === "OBJECTION_RESPONSE") {
    bgColor = "bg-[#E6F4FF]"; // Light blue for Applicant response
    titleColor = "text-[#0050B3]";
  }

  return (
    <div className={`flex flex-col gap-2 rounded-xl p-4 ${bgColor} transition-all`}>
      <div className="flex items-center justify-between">
        <span className={`text-[12px] font-bold uppercase tracking-wide ${titleColor}`}>
          {comment.commenter_name || "Official"}
        </span>
        {isObjection && (
          <span className="rounded-full bg-[#FF4D4F] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
            Objection
          </span>
        )}
      </div>
      <p className="text-[13px] leading-relaxed text-[#343434]">
        {comment.comment}
      </p>
      <span className="text-[10px] text-[#343434] opacity-40 self-end">
        {formatDate(comment.created_at)}
      </span>
    </div>
  );
};

export default function CommentsDrawer({
  isOpen,
  onClose,
  applicationId,
  applicationNumber,
  isObjectionMode = false,
  onObjectionSubmit,
}: CommentsDrawerProps) {
  const { data: comments = [], isLoading } = useApplicationComments(applicationId);
  const { mutateAsync: addComment } = useAddComment();
  
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when comments load or new comment added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments, isOpen]);

  const handleSend = async () => {
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (isObjectionMode && onObjectionSubmit) {
        await onObjectionSubmit(newComment);
      } else {
        await addComment({
          id: applicationId,
          data: {
            comment: newComment,
            comment_type: "GENERAL",
          },
        });
      }
      setNewComment("");
      if (isObjectionMode) onClose(); // Close drawer after raising objection
    } catch (error) {
      console.error("Failed to process comment/objection", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                {isObjectionMode ? "Raise Objection" : "Objection & Comments"} ({applicationNumber})
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

            {/* Comments List */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-white"
            >
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0C83FF] border-t-transparent" />
                </div>
              ) : comments.length > 0 ? (
                comments.map((c) => <CommentCard key={c.id} comment={c} />)
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-gray-400 gap-2 opacity-60">
                  <Image src="/dashboard/icons/comment-icon.svg" alt="" width={40} height={40} className="grayscale" />
                  <p className="text-sm">No comments yet</p>
                </div>
              )}
            </div>

            {/* Input Section */}
            <div className="border-t border-[#D6D9DE] p-4 bg-white flex flex-col gap-3">
              {isObjectionMode && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2 px-3">
                  <Image src="/dashboard/icons/warning.svg" alt="Objection" width={16} height={16} />
                  <span className="text-[11px] font-medium text-red-600">You are raising an objection. This will halt the process until clarified.</span>
                </div>
              )}
              <div className="flex items-center gap-3 rounded-xl border border-[#D6D9DE] bg-[#F9FAFB] px-4 py-2 focus-within:border-[#0C83FF] transition-all">
                <input
                  type="text"
                  placeholder={isObjectionMode ? "Enter your objection detail..." : "Enter Your Comment"}
                  className="flex-1 bg-transparent text-sm text-[#343434] outline-none placeholder:text-gray-400"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <div className="flex items-center gap-2 border-l border-[#D6D9DE] pl-3">
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <Image src="/dashboard/icons/applications/step-upload.svg" alt="Attach" width={20} height={20} className="opacity-60" />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={!newComment.trim() || isSubmitting}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isObjectionMode ? "bg-red-500 hover:bg-red-600" : "bg-[#0C83FF] hover:bg-blue-600"}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="rotate-45 ml-[-2px] mt-[-1px]">
                      <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
