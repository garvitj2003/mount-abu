"use client";
import React from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import NavigationHeader from "@/components/landing/NavigationHeader";
import Footer from "@/components/landing/Footer";
import DestinationMapSection from "@/components/landing/DestinationMapSection";
import { motion, Variants } from "motion/react";
import { useSearchParams } from "next/navigation";
import {
  useEvent,
  useNotice,
  useEvents,
  useNotices,
} from "@/hooks/useWebsiteContent";
import { Heart, Clock, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function EventNoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "event";

  const { id: idStr } = React.use(params);
  const id = parseInt(idStr);

  const { data: event, isLoading: isLoadingEvent } = useEvent(
    type === "event" ? id : 0,
  );
  const { data: notice, isLoading: isLoadingNotice } = useNotice(
    type === "notice" ? id : 0,
  );

  const { data: eventsData } = useEvents({ limit: 5 });
  const { data: noticesData } = useNotices({ limit: 5 });

  const isLoading = isLoadingEvent || isLoadingNotice;

  const item = React.useMemo(() => {
    if (type === "event" && event) {
      return {
        id: event.id,
        image: event.image_url || "/images/fairs-festivals.png",
        tag: event.event_type || "Event",
        title: event.title,
        date: formatDate(event.date),
        description: event.description || "",
        type: "event",
        location: event.venue || "N/A",
        status: event.status,
        time: "",
      };
    }
    if (type === "notice" && notice) {
      return {
        id: notice.id,
        image: notice.image_url || "/images/news/vasant-panchami.jpeg",
        tag: notice.notice_type || "Notice",
        title: notice.title,
        date: formatDate(notice.published_on),
        description: notice.content || "",
        type: "notice",
        location: "",
        status: notice.status,
        time: "",
      };
    }
    return null;
  }, [type, event, notice]);

  const otherItems = React.useMemo(() => {
    if (type === "event") {
      return (eventsData?.events || [])
        .filter((e) => e.id !== id)
        .map((e) => ({
          id: e.id,
          title: e.title,
          image: e.image_url || "/images/fairs-festivals.png",
          date: formatDate(e.date),
          type: "event",
        }));
    }
    return (noticesData?.notices || [])
      .filter((n) => n.id !== id)
      .map((n) => ({
        id: n.id,
        title: n.title,
        image: n.image_url || "/images/news/vasant-panchami.jpeg",
        date: formatDate(n.published_on),
        type: "notice",
      }));
  }, [type, eventsData, noticesData, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBEF] flex flex-col font-montserrat">
        <NavigationHeader variant="light" />
        <main className="flex-grow w-full flex items-center justify-center pt-32">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2D4A2D] border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FFFBEF] flex flex-col font-montserrat">
      <NavigationHeader variant="light" />

      <main className="flex-grow w-full pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-20.5">
          {/* Header Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex flex-col gap-8 mb-8"
          >
            {/* Top Bar with Back Button and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/events-and-notice")}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <ArrowLeft size={28} className="text-[#2D4A2D]" />
                </button>
                <h1 className="font-baron text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D4A2D] tracking-wide leading-tight">
                  {item.title}
                </h1>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <button className="w-10 h-10 rounded-full bg-[#2D4A2D] flex items-center justify-center text-white hover:bg-[#1f331f] transition-colors">
                  <Heart size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-[#2D4A2D] flex items-center justify-center text-white hover:bg-[#1f331f] transition-colors">
                  <Clock size={18} />
                </button>
                <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-[#2D4A2D] hover:bg-gray-50 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-3">
              <span className="bg-[#F5F2E9] border border-[#D4AF37] px-6 py-3 rounded-[8px] font-montserrat font-medium text-[#1C1C1C]">
                {item.tag}
              </span>
              <span className="bg-[#F5F2E9] border border-[#D4AF37] px-6 py-3 rounded-[8px] font-montserrat font-medium text-[#1C1C1C]">
                {item.date}
              </span>
              {item.time && (
                <span className="bg-[#F5F2E9] border border-[#D4AF37] px-6 py-3 rounded-[8px] font-montserrat font-medium text-[#1C1C1C]">
                  {item.time}
                </span>
              )}
              <span className="bg-[#F5F2E9] border border-[#D4AF37] px-6 py-3 rounded-[8px] font-montserrat font-medium text-[#1C1C1C] uppercase">
                {item.status || "Active"}
              </span>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16">
            {/* Left: Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="w-full lg:w-1/2"
            >
              <div className="relative aspect-square w-full rounded-[24px] overflow-hidden shadow-lg border border-[#D4AF37]/30">
                <Image
                  src={item.image}
                  alt={item.title}
                  unoptimized
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Right: Description */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="w-full lg:w-1/2 flex flex-col justify-start"
            >
              <h2 className="font-baron text-2xl font-bold text-[#2D4A2D] mb-6 uppercase">
                {item.type === "event" ? "Event Description" : "Notice Details"}
              </h2>
              <p className="font-montserrat text-[#343434] leading-relaxed text-base md:text-lg text-justify">
                {item.description || "No description available."}
              </p>
            </motion.div>
          </div>

          {/* Where Section */}
          {item.location && item.location !== "N/A" && (
            <div className="mb-16">
              <DestinationMapSection />
            </div>
          )}

          {/* Other Items Section */}
          {otherItems.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="mb-8"
            >
              <h2 className="font-baron text-2xl font-bold text-[#2D4A2D] mb-8 uppercase">
                {item.type === "event" ? "Other Festivals" : "Other Notices"}
              </h2>
              <div className="flex flex-wrap gap-6">
                {otherItems.map((other) => (
                  <Link
                    href={`/events-and-notice/${other.id}?type=${other.type}`}
                    key={other.id}
                    className="w-[338px] shrink-0"
                  >
                    <div className="group cursor-pointer">
                      <div className="relative h-[250px] w-full rounded-[20px] overflow-hidden mb-4 border border-[#2D4A2D]/20">
                        <Image
                          src={other.image}
                          alt={other.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-montserrat font-bold text-xl text-[#1C1C1C] group-hover:text-[#2D4A2D] transition-colors mb-1">
                        {other.title}
                      </h3>
                      <p className="font-montserrat text-[#179362] text-sm">
                        {other.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
