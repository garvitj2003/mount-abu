"use client";

import { StatCard } from "@/components/common/stats/StatCard";
import { MaterialUsageChart } from "@/components/common/charts/MaterialUsageChart";
import { AvailableQuantityChart } from "@/components/common/charts/AvailableQuantityChart";
import { MaterialBreakdown } from "@/components/common/charts/MaterialBreakdown";
import { PhaseTokenUsageChart } from "@/components/common/charts/PhaseTokenUsageChart";
import { useCitizenDashboard } from "@/hooks/useDashboard";
import Image from "next/image";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { useUser } from "@/hooks/useUser";

export default function DashboardCitizenPage() {
  const { data, isLoading } = useCitizenDashboard();
  const { data: user } = useUser();

  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const getExportInfo = () => {
    return [
      [
        "Downloaded By",
        user?.name?.trim()
          ? `${user.name} (${user.mobile})`
          : user?.mobile || "Citizen"
      ],
      [
        "Download Date",
        new Date().toLocaleString()
      ],
      [
        "Dashboard",
        "Citizen Dashboard"
      ]
    ];
  };

  const handleExportExcel = () => {

    const info = getExportInfo();

    const excelData: any[] = [

      // ================= HEADER INFO =================

      ["Citizen Dashboard Report"],

      [],

      ...info,

      [],


      // ================= KPI =================

      ["Overview KPI"],

      [
        "Metric",
        "Value"
      ],

      [
        "Total Applications",
        overview?.total_applications || 0
      ],

      [
        "Active Applications",
        overview?.active_applications || 0
      ],

      [
        "Tokens Issued",
        overview?.tokens_issued || 0
      ],

      [
        "Complaints",
        overview?.total_complaints || 0
      ],

      [
        "Complaints Closed",
        overview?.closed_complaints || 0
      ],


      [],


      // ================= MATERIAL USAGE =================

      ["Material Usage Overview"],

      [
        "Material",
        "Unit",
        "Permitted Quantity",
        "Used Quantity"
      ],


      ...(data?.material_usage || []).map((item: any) => [
        item.material_name,
        item.unit,
        item.permitted_quantity,
        item.used_quantity
      ]),


      [],


      // ================= AVAILABLE QUANTITY =================

      ["Available Quantity"],

      [
        "Material",
        "Unit",
        "Available Quantity"
      ],


      ...(data?.available_quantity || []).map((item: any) => [
        item.material_name,
        item.unit,
        item.available_quantity
      ]),


      [],


      // ================= PHASE TOKEN USAGE =================

      ["Phase-wise Token Usage"],

      [
        "Phase Status",
        "Count"
      ],


      ...(data?.phase_token_usage || []).map((item: any) => [
        item.phase_status,
        item.count
      ])

    ];


    const ws = XLSX.utils.aoa_to_sheet(
      excelData
    );


    // Column width adjust
    ws["!cols"] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 }
    ];


    const wb = XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Citizen Dashboard"
    );


    XLSX.writeFile(
      wb,
      `citizen-dashboard-${Date.now()}.xlsx`
    );

  };

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;

    try {
      setIsExportingPDF(true);

      const element = dashboardRef.current;
      const infoHeight = 25;

      const originalOverflow = element.style.overflow;
      const originalHeight = element.style.height;


      element.style.overflow = "visible";
      element.style.height = "auto";


      const scrollables = element.querySelectorAll<HTMLElement>(
        '[class*="overflow"]'
      );


      const previousStyles = Array.from(scrollables).map((el) => ({
        el,
        overflow: el.style.overflow,
        height: el.style.height,
      }));


      scrollables.forEach((el) => {
        el.style.overflow = "visible";
        el.style.height = "auto";
      });


      await new Promise((r) => setTimeout(r, 300));


      const canvas = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#F5F6F7",
        width: element.scrollWidth,
        height: element.scrollHeight,
      });


      previousStyles.forEach((item) => {
        item.el.style.overflow = item.overflow;
        item.el.style.height = item.height;
      });


      element.style.overflow = originalOverflow;
      element.style.height = originalHeight;



      const pdf = new jsPDF(
        "p",
        "mm",
        "a4"
      );


      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();


      const imgProps = pdf.getImageProperties(canvas);


      const imgWidth = pageWidth;
      const imgHeight =
        (imgProps.height * imgWidth) /
        imgProps.width;


      let heightLeft = imgHeight;
      let position = 0;


      pdf.setFontSize(12);

      let infoY = 10;

      getExportInfo().forEach(([key, value]) => {
        pdf.text(
          `${key}: ${value}`,
          10,
          infoY
        );

        infoY += 6;
      });


      pdf.addImage(
        canvas,
        "PNG",
        0,
        position + infoHeight,
        imgWidth,
        imgHeight
      );


      heightLeft -= pageHeight;


      while (heightLeft > 0) {

        position = heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(
          canvas,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;
      }


      pdf.save(
        `citizen-dashboard-${Date.now()}.pdf`
      );


    } catch (err) {

      console.error(err);

    } finally {

      setIsExportingPDF(false);

    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#F5F6F7]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
      </div>
    );
  }

  const overview = data?.overview;

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-5 py-3">

        <div>
          <h1 className="text-lg font-medium text-[#343434]">
            Dashboard
          </h1>

          <p className="text-xs text-[#343434] opacity-80">
            View and track all your applications and complaints at a glance.
          </p>
        </div>


        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-2 rounded-lg border border-[#D6D9DE] bg-[#F5F6F7] px-4 py-2 text-sm font-medium hover:bg-gray-200"
          >

            {isExportingPDF ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#343434] border-t-transparent" />
            ) : (
              <Image
                src="/dashboard/icons/applications/pdficon.svg"
                alt=""
                width={14}
                height={14}
              />
            )}

            {isExportingPDF ? "Exporting..." : "Export PDF"}

          </button>

          <div className="h-6 w-px bg-[#D6D9DE] mx-1" />

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 rounded-lg bg-[#0C83FF] px-4 py-2 text-sm font-medium text-white"
          >
            <Image
              src="/dashboard/icons/applications/csvicon.svg"
              alt=""
              width={14}
              height={14}
            />

            Export Excel

          </button>
        </div>

      </div>

      {/* Main Content */}
      <div ref={dashboardRef} className="flex-1 flex flex-col gap-4 p-5 overflow-y-auto">

        {/* Overview Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-medium text-[#343434]">Overview</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            <StatCard
              title="Total Applications"
              count={overview?.total_applications || 0}
              subtext="All Applications"
              iconType="applications"
              color="#0C83FF"
            />
            <StatCard
              title="Active Applications"
              count={overview?.active_applications || 0}
              subtext="Pending approvals"
              iconType="applications"
              color="#EF4444"
            />
            <StatCard
              title="Tokens Issued"
              count={overview?.tokens_issued || 0}
              subtext="Phase-wise + renovation"
              iconType="token"
              color="#059669"
            />
            <StatCard
              title="Complaints"
              count={overview?.total_complaints || 0}
              subtext="Total complaints"
              iconType="token"
              color="#F58646"
            />
            <StatCard
              title="Complaints Closed"
              count={overview?.closed_complaints || 0}
              subtext="Closed Complains"
              iconType="token"
              color="#059669"
            />
          </div>
        </div>

        {/* Analysis Section */}
        <div className="flex flex-col gap-3 pb-10">
          <h2 className="text-base font-medium text-[#343434]">
            Token & Material Analysis
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

            {/* Column 1: Material Usage Overview */}
            <div className="flex h-full flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
              <h3 className="mb-3 text-xs font-medium text-[#343434]">
                Material Usage Overview
              </h3>
              <div className="flex flex-1 items-center justify-center min-h-[220px]">
                <MaterialUsageChart data={data?.material_usage || []} />
              </div>
            </div>

            {/* Column 2: Available Quantity */}
            <div className="flex h-full flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
              <h3 className="mb-3 text-xs font-medium text-[#343434]">
                Available Quantity
              </h3>
              <div className="flex flex-1 items-center justify-center min-h-[220px]">
                <AvailableQuantityChart data={data?.available_quantity || []} />
              </div>
            </div>

            {/* Column 3: Breakdown & Token Usage */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
                <h3 className="mb-3 text-xs font-medium text-[#343434]">
                  Top Material Breakdown
                </h3>
                <MaterialBreakdown data={data?.material_usage || []} />
              </div>

              <div className="flex min-h-[180px] flex-1 flex-col rounded-lg border border-[#D6D9DE] bg-white p-4 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.08)]">
                <h3 className="mb-4 text-xs font-medium text-[#343434]">
                  Phase-wise Token Usage
                </h3>
                <div className="flex flex-1 items-center justify-center">
                  <PhaseTokenUsageChart data={data?.phase_token_usage || []} />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
