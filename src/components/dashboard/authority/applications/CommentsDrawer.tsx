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
  userRole?: string;
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
  let bgColor = "bg-[#F5F6F7]";
  let titleColor = "text-[#343434]";
  
  // Note: Backend uses 'OBJECTION_COMMENT' for objections
  const isObjection = comment.comment_type === "OBJECTION_COMMENT";

  if (comment.comment_type === "DEPT_REVIEW") {
    bgColor = "bg-[#E6F7F5]"; 
    titleColor = "text-[#008080]";
  } else if (isObjection) {
    bgColor = "bg-[#FFF1F0]"; 
    titleColor = "text-[#CF1322]";
  } else if (comment.comment_type === "OBJECTION_RESPONSE") {
    bgColor = "bg-[#E6F4FF]"; 
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
  userRole,
}: CommentsDrawerProps) {
  const { data: comments = [], isLoading } = useApplicationComments(applicationId, { enabled: isOpen });
  const { mutateAsync: addComment } = useAddComment();
  
  const [newComment, setNewComment] = useState("");
  const [commentType, setCommentType] = useState<"GENERAL" | "DEPT_REVIEW">("GENERAL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAuthority = userRole && userRole !== "CITIZEN";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments, isOpen]);

  // Reset type when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      setCommentType("GENERAL");
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addComment({
        id: applicationId,
        data: {
          comment: newComment,
          comment_type: commentType,
        },
      });
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative z-10 h-full w-full max-w-[480px] bg-white shadow-2xl font-onest flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-[#F5F6F7] px-6 py-4">
              <h2 className="text-[15px] font-medium text-[#343434]">
                Objection & Comments ({applicationNumber})
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              >
                <Image src="/dashboard/icons/close.svg" alt="Close" width={18} height={18} />
              </button>
            </div>

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

            <div className="border-t border-[#D6D9DE] p-4 bg-white flex flex-col gap-3">
              {userRole === "COLLECTOR" ? (
                <div className="rounded-xl border border-[#D6D9DE] bg-[#F9FAFB] p-3 text-center text-xs font-medium text-gray-500">
                  Read-only mode (Collector role cannot post comments)
                </div>
              ) : (
                <>
                  {isAuthority && (
                <div className="flex flex-col gap-1.5 px-1 pb-1">
                  {/* Visibility Explainer Label */}
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    {commentType === "DEPT_REVIEW" 
                      ? "🔒 Internal: Visible only to Authorities, hidden from Citizen"
                      : "🌐 Public: Visible to Citizen & all Authorities"
                    }
                  </span>
                  
                  {/* Selector Buttons */}
                  <div className="flex gap-2 p-1 bg-[#E5E7EB] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCommentType("GENERAL")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer text-center ${
                        commentType === "GENERAL" 
                          ? "bg-white text-[#343434] shadow-xs" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      General Comment
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentType("DEPT_REVIEW")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer text-center ${
                        commentType === "DEPT_REVIEW" 
                          ? "bg-[#008080] text-white shadow-xs" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Department Review
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 rounded-xl border border-[#D6D9DE] bg-[#F9FAFB] px-4 py-2 focus-within:border-[#0C83FF] transition-all">
                <input
                  type="text"
                  placeholder="Enter Your Comment"
                  className="flex-1 bg-transparent text-sm text-[#343434] outline-none placeholder:text-gray-400"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <div className="flex items-center gap-2 border-l border-[#D6D9DE] pl-3">
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <Image src="/dashboard/icons/applications/fileattach.svg" alt="Attach" width={20} height={20} className="opacity-60" />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={!newComment.trim() || isSubmitting}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors bg-[#0C83FF] hover:bg-blue-600 disabled:opacity-50"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="-rotate-45 ml-[-2px] mt-[-1px]">
                      <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
