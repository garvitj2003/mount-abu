"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import DropdownSelect from "@/components/ui/DropdownSelect";
import TablePagination from "@/components/ui/TablePagination";
import { useCityProfile, useUpdateCityProfile } from "@/hooks/useCityProfile";
import { 
  useNotices, 
  useTenders, 
  useEvents, 
  useLeaders, 
  useDownloads 
} from "@/hooks/useWebsiteContent";
import AddNoticeDrawer from "@/components/dashboard/authority/website-content/AddNoticeDrawer";
import AddTenderDrawer from "@/components/dashboard/authority/website-content/AddTenderDrawer";
import AddEventDrawer from "@/components/dashboard/authority/website-content/AddEventDrawer";
import AddLeaderDrawer from "@/components/dashboard/authority/website-content/AddLeaderDrawer";
import AddContactDrawer from "@/components/dashboard/authority/website-content/AddContactDrawer";
import AddDownloadDrawer from "@/components/dashboard/authority/website-content/AddDownloadDrawer";
import { type components } from "@/types/api";

type TabType = "Notices" | "Tenders" | "Events" | "Leaders Board" | "Contact Diary" | "City Profile" | "Downloads";
type CityProfileUpdate = components["schemas"]["CityProfileUpdate"];

const TABS: TabType[] = [
  "Notices", 
  "Tenders", 
  "Events", 
  "Leaders Board", 
  "Contact Diary", 
  "City Profile", 
  "Downloads"
];

interface TableColumn {
  header: string;
  key: string;
  width?: string;
  render?: (row: any) => React.ReactNode;
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const RenderStatus = (status: string) => {
  const isDanger = ["EXPIRED", "INACTIVE", "CANCELLED", "CLOSED", "REJECTED"].includes(status.toUpperCase());
  const isWarning = ["UPCOMING", "PENDING"].includes(status.toUpperCase());
  
  let iconSrc = "/dashboard/icons/tick-round-green.svg";
  let textColor = "text-[#059669]";

  if (isDanger) {
    iconSrc = "/dashboard/icons/cross-round-red.svg";
    textColor = "text-[#EF4444]";
  } else if (isWarning) {
    iconSrc = "/dashboard/icons/timer-round.svg";
    textColor = "text-[#B39632]";
  }

  return (
    <div className="flex items-center gap-2">
      <Image src={iconSrc} alt={status} width={14} height={14} />
      <span className={`text-sm font-normal ${textColor} capitalize`}>{status.toLowerCase()}</span>
    </div>
  );
};

const RenderActions = () => (
  <div className="text-center">
      <button className="text-[#343434] hover:bg-gray-200 rounded p-1 transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 8.66667C13.7015 8.66667 14 8.36819 14 8C14 7.63181 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6667 7.63181 12.6667 8C12.6667 8.36819 12.9651 8.66667 13.3333 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.66667 8.66667C3.03486 8.66667 3.33333 8.36819 3.33333 8C3.33333 7.63181 3.03486 7.33333 2.66667 7.33333C2.29848 7.33333 2 7.63181 2 8C2 8.36819 2.29848 8.66667 2.66667 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
      </button>
  </div>
);

const NOTICE_COLUMNS: TableColumn[] = [
  { header: "Notice Title", key: "title", render: (row) => <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">{row.title}</span> },
  { header: "Notice Type", key: "notice_type" },
  { header: "Published On", key: "published_on", render: (row) => formatDate(row.published_on) },
  { header: "Valid Till", key: "valid_till", render: (row) => formatDate(row.valid_till) },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { 
    header: "Visibility", 
    key: "visibility",
    render: (row) => {
      const isInternal = row.visibility === "INTERNAL";
      return (
        <div className="flex items-center gap-1.5">
           { !isInternal ? (
             <Image src="/dashboard/icons/applications/visibility-public.svg" alt="Public" width={20} height={20} />
           ) : (
             <Image src="/dashboard/icons/applications/visibility-internal.svg" alt="Internal" width={20} height={20} />
           )}
          <span className={`text-sm font-normal ${isInternal ? "text-[#F35C86]" : "text-[#404B86]"} capitalize`}>
            {row.visibility?.toLowerCase()}
          </span>
        </div>
      );
    }
  },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

const TENDER_COLUMNS: TableColumn[] = [
  { header: "Tender Title", key: "title", render: (row) => <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">{row.title}</span> },
  { header: "Tender Type", key: "tender_type" },
  { header: "Tender Amount", key: "amount", render: (row) => row.amount ? `₹${row.amount}` : "—" },
  { header: "Published On", key: "published_on", render: (row) => formatDate(row.published_on) },
  { header: "Deadline", key: "submission_deadline", render: (row) => formatDate(row.submission_deadline) },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

const EVENT_COLUMNS: TableColumn[] = [
  { header: "Event Title", key: "title", render: (row) => <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">{row.title}</span> },
  { header: "Event Type", key: "event_type" },
  { header: "Date", key: "date", render: (row) => formatDate(row.date) },
  { header: "Venue", key: "venue" },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

const LEADERS_COLUMNS: TableColumn[] = [
  { header: "Name", key: "name", render: (row) => <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">{row.name}</span> },
  { header: "Designation", key: "designation" },
  { header: "Tenure Start", key: "tenure_start", render: (row) => formatDate(row.tenure_start) },
  { header: "Tenure End", key: "tenure_end", render: (row) => formatDate(row.tenure_end) },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

const DOWNLOAD_COLUMNS: TableColumn[] = [
  { header: "Document Title", key: "document_title", render: (row) => <span className="text-sm font-medium text-[#0C83FF] hover:underline cursor-pointer">{row.document_title}</span> },
  { header: "Category", key: "document_type" },
  { header: "Uploaded On", key: "created_at", render: (row) => formatDate(row.created_at) },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

export default function AuthorityWebsiteContentPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Notices");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Pagination & Filters
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [showRightShadow, setShowRightShadow] = useState(false);

  // Drawer States
  const [isNoticeDrawerOpen, setIsNoticeDrawerOpen] = useState(false);
  const [isTenderDrawerOpen, setIsTenderDrawerOpen] = useState(false);
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);
  const [isLeaderDrawerOpen, setIsLeaderDrawerOpen] = useState(false);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [isDownloadDrawerOpen, setIsDownloadDrawerOpen] = useState(false);

  // Data Fetching
  const params = { limit, offset: (page - 1) * limit };
  const { data: noticesData, isLoading: isLoadingNotices } = useNotices(params);
  const { data: tendersData, isLoading: isLoadingTenders } = useTenders(params);
  const { data: eventsData, isLoading: isLoadingEvents } = useEvents(params);
  const { data: leadersData, isLoading: isLoadingLeaders } = useLeaders(params);
  const { data: downloadsData, isLoading: isLoadingDownloads } = useDownloads(params);
  
  const { data: cityProfile, isLoading: isLoadingProfile } = useCityProfile();
  const updateProfile = useUpdateCityProfile();

  const [profileForm, setProfileForm] = useState({
    area_sq_km: "",
    no_of_wards: "",
    ward_boundaries: "",
    population_estimate: "",
    rental_properties_of_corporation: "",
    number_of_slums: "",
    solid_waste_per_day: "",
    street_light_poles: "",
    employees_in_board: "",
    households_residential: "",
    households_shops_offices: "",
    households_open_plots: "",
    birth_registration_per_year: "",
    birth_certificate_per_year: ""
  });

  useEffect(() => {
    if (cityProfile) {
      setProfileForm({
        area_sq_km: cityProfile.area_sq_km || "",
        no_of_wards: cityProfile.no_of_wards?.toString() || "",
        ward_boundaries: cityProfile.ward_boundaries || "",
        population_estimate: cityProfile.population_estimate?.toString() || "",
        rental_properties_of_corporation: cityProfile.rental_properties_of_corporation?.toString() || "",
        number_of_slums: cityProfile.number_of_slums?.toString() || "",
        solid_waste_per_day: cityProfile.solid_waste_per_day || "",
        street_light_poles: cityProfile.street_light_poles?.toString() || "",
        employees_in_board: cityProfile.employees_in_board?.toString() || "",
        households_residential: cityProfile.households_residential?.toString() || "",
        households_shops_offices: cityProfile.households_shops_offices?.toString() || "",
        households_open_plots: cityProfile.households_open_plots?.toString() || "",
        birth_registration_per_year: cityProfile.birth_registration_per_year?.toString() || "",
        birth_certificate_per_year: cityProfile.birth_certificate_per_year?.toString() || ""
      });
    }
  }, [cityProfile]);

  const handleProfileChange = (field: keyof typeof profileForm, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const isCardChanged = (fields: (keyof typeof profileForm)[]) => {
    if (!cityProfile) return false;
    return fields.some(field => {
      const currentValue = profileForm[field];
      const originalValue = (cityProfile as any)[field]?.toString() || "";
      return currentValue !== originalValue;
    });
  };

  const handleSave = async (fields: (keyof typeof profileForm)[]) => {
    const updateData: any = {};
    fields.forEach(field => {
      const value = profileForm[field];
      if (["no_of_wards", "population_estimate", "rental_properties_of_corporation", "number_of_slums", "street_light_poles", "employees_in_board", "households_residential", "households_shops_offices", "households_open_plots", "birth_registration_per_year", "birth_certificate_per_year"].includes(field)) {
        updateData[field] = value === "" ? null : Number(value);
      } else {
        updateData[field] = value === "" ? null : value;
      }
    });

    try {
      await updateProfile.mutateAsync(updateData);
      alert("City profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to save changes.");
    }
  };

  const checkScroll = () => {
    const el = tableContainerRef.current;
    if (!el) return;
    const canScroll = el.scrollWidth > el.clientWidth;
    const isAtEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
    setShowRightShadow(canScroll && !isAtEnd);
  };

  useEffect(() => {
    const activeTabIdx = TABS.indexOf(activeTab);
    const activeTabElement = tabsRef.current[activeTabIdx];
    if (activeTabElement) {
      setIndicatorStyle({
        width: activeTabElement.offsetWidth,
        left: activeTabElement.offsetLeft,
      });
    }
  }, [activeTab]);

  const getTabData = () => {
    switch (activeTab) {
      case "Tenders":
        return { 
          columns: TENDER_COLUMNS, 
          data: tendersData?.tenders || [],
          total: tendersData?.total || 0,
          isLoading: isLoadingTenders,
          onAdd: () => setIsTenderDrawerOpen(true)
        };
      case "Events":
        return { 
          columns: EVENT_COLUMNS, 
          data: eventsData?.events || [],
          total: eventsData?.total || 0,
          isLoading: isLoadingEvents,
          onAdd: () => setIsEventDrawerOpen(true)
        };
      case "Leaders Board":
        return { 
          columns: LEADERS_COLUMNS, 
          data: leadersData?.leaders || [],
          total: leadersData?.total || 0,
          isLoading: isLoadingLeaders,
          onAdd: () => setIsLeaderDrawerOpen(true)
        };
      case "Downloads":
        return { 
          columns: DOWNLOAD_COLUMNS, 
          data: downloadsData?.downloads || [],
          total: downloadsData?.total || 0,
          isLoading: isLoadingDownloads,
          onAdd: () => setIsDownloadDrawerOpen(true)
        };
      case "Notices":
      default:
        return { 
          columns: NOTICE_COLUMNS, 
          data: noticesData?.notices || [],
          total: noticesData?.total || 0,
          isLoading: isLoadingNotices,
          onAdd: () => setIsNoticeDrawerOpen(true)
        };
    }
  };

  const tabContent = getTabData();

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-5 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-base font-medium text-[#343434]">Website Content Management</h1>
          <p className="text-xs font-normal text-[#343434]">
            Manage notices, tenders, events, and other public-facing information.
          </p>
        </div>
        {activeTab !== "City Profile" && activeTab !== "Contact Diary" && (
          <button 
            onClick={tabContent.onAdd}
            className="flex items-center justify-center gap-2.5 rounded-lg bg-[#0C83FF] px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors cursor-pointer"
          >
            {activeTab === "Notices" ? "Add New Notice" :
             activeTab === "Tenders" ? "Add New Tender" :
             activeTab === "Events" ? "Add New Event" :
             activeTab === "Downloads" ? "Add New Download" :
             activeTab === "Leaders Board" ? "Add New Leader" :
             `Add New ${activeTab}`}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="relative flex items-center gap-[6px] bg-white px-5 py-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.13)] overflow-x-auto no-scrollbar whitespace-nowrap">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            ref={(el) => { tabsRef.current[idx] = el; }}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`flex items-center justify-center gap-2.5 px-3 py-2 text-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab ? "font-semibold text-[#0C83FF]" : "font-normal text-[#343434]"
            }`}
          >
            {tab}
          </button>
        ))}
        <div 
          className="absolute bottom-0 h-1.5 rounded-t-lg bg-[#0C83FF] transition-all duration-300"
          style={{ width: `${indicatorStyle.width}px`, left: `${indicatorStyle.left}px` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {activeTab === "City Profile" ? (
          isLoadingProfile ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-10">
              {/* Column 1: City Profile */}
              <div className="flex flex-col gap-6 bg-white border border-[#D6D9DE] p-5 rounded-lg shadow-sm">
                <div className="flex justify-between items-center border-b border-[#D6D9DE] pb-3">
                  <h2 className="text-lg font-medium text-[#343434]">City Profile</h2>
                  <button 
                    disabled={!isCardChanged(["area_sq_km", "no_of_wards", "ward_boundaries", "population_estimate", "rental_properties_of_corporation", "number_of_slums", "solid_waste_per_day", "street_light_poles", "employees_in_board"]) || updateProfile.isPending}
                    onClick={() => handleSave(["area_sq_km", "no_of_wards", "ward_boundaries", "population_estimate", "rental_properties_of_corporation", "number_of_slums", "solid_waste_per_day", "street_light_poles", "employees_in_board"])}
                    className="bg-[#0C83FF] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {updateProfile.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Area In Sq. km.</label>
                    <input type="text" value={profileForm.area_sq_km} onChange={(e) => handleProfileChange("area_sq_km", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">No. of wards</label>
                    <input type="text" value={profileForm.no_of_wards} onChange={(e) => handleProfileChange("no_of_wards", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Ward boundries</label>
                    <input type="text" value={profileForm.ward_boundaries} onChange={(e) => handleProfileChange("ward_boundaries", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Population estimate</label>
                    <input type="text" value={profileForm.population_estimate} onChange={(e) => handleProfileChange("population_estimate", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-normal text-[#343434]">Rental Properties of corporation</label>
                  <input type="text" value={profileForm.rental_properties_of_corporation} onChange={(e) => handleProfileChange("rental_properties_of_corporation", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Number of Slums</label>
                    <input type="text" value={profileForm.number_of_slums} onChange={(e) => handleProfileChange("number_of_slums", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Solid waste per day</label>
                    <input type="text" value={profileForm.solid_waste_per_day} onChange={(e) => handleProfileChange("solid_waste_per_day", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Street Light poles</label>
                    <input type="text" value={profileForm.street_light_poles} onChange={(e) => handleProfileChange("street_light_poles", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Employees in board</label>
                    <input type="text" value={profileForm.employees_in_board} onChange={(e) => handleProfileChange("employees_in_board", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                </div>
              </div>

              {/* Column 2: Households */}
              <div className="flex flex-col gap-6 bg-white border border-[#D6D9DE] p-5 rounded-lg shadow-sm">
                <div className="flex justify-between items-center border-b border-[#D6D9DE] pb-3">
                  <h2 className="text-base font-semibold text-[#343434]">No of House holds</h2>
                  <button 
                    disabled={!isCardChanged(["households_residential", "households_shops_offices", "households_open_plots"]) || updateProfile.isPending}
                    onClick={() => handleSave(["households_residential", "households_shops_offices", "households_open_plots"])}
                    className="bg-[#0C83FF] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {updateProfile.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Residential</label>
                    <input type="text" value={profileForm.households_residential} onChange={(e) => handleProfileChange("households_residential", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Shops & Offices</label>
                    <input type="text" value={profileForm.households_shops_offices} onChange={(e) => handleProfileChange("households_shops_offices", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Open Plots</label>
                    <input type="text" value={profileForm.households_open_plots} onChange={(e) => handleProfileChange("households_open_plots", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                </div>
              </div>

              {/* Column 3: Birth/Death */}
              <div className="flex flex-col gap-6 bg-white border border-[#D6D9DE] p-5 rounded-lg shadow-sm">
                <div className="flex justify-between items-center border-b border-[#D6D9DE] pb-3">
                  <h2 className="text-base font-semibold text-[#343434]">Birth/Death</h2>
                  <button 
                    disabled={!isCardChanged(["birth_registration_per_year", "birth_certificate_per_year"]) || updateProfile.isPending}
                    onClick={() => handleSave(["birth_registration_per_year", "birth_certificate_per_year"])}
                    className="bg-[#0C83FF] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {updateProfile.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Registration per year</label>
                    <input type="text" value={profileForm.birth_registration_per_year} onChange={(e) => handleProfileChange("birth_registration_per_year", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Certificate per year</label>
                    <input type="text" value={profileForm.birth_certificate_per_year} onChange={(e) => handleProfileChange("birth_certificate_per_year", e.target.value)} className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" />
                  </div>
                </div>
              </div>
            </div>
          )
        ) : activeTab === "Contact Diary" ? (
          <div className="flex h-64 items-center justify-center text-gray-400 italic">
            Contact Diary is coming soon.
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4 min-h-[400px]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex w-[209px] items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 h-9">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60 shrink-0">
                  <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 14L11.1 11.1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border-none bg-transparent p-0 text-sm outline-none" />
              </div>
            </div>

            <div ref={tableContainerRef} onScroll={checkScroll} className="w-full overflow-x-auto">
              {tabContent.isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
                </div>
              ) : (
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      {tabContent.columns.map((col, idx) => (
                        <th key={idx} className={`px-2 py-3 text-left bg-white border-b border-[#D6D9DE] ${col.key === "actions" ? "sticky right-0 z-20" : ""}`}>
                          <div className={`flex items-center gap-2 ${idx < tabContent.columns.length - 1 && col.key !== "actions" ? "border-r border-[rgba(0,0,0,0.1)]" : ""} pr-2`}>
                            <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase whitespace-nowrap">{col.header}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tabContent.data.length > 0 ? (
                      tabContent.data.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                          {tabContent.columns.map((col, colIdx) => (
                            <td key={colIdx} className={`px-2 py-3 border-b border-[#D6D9DE] bg-white group-hover:bg-gray-50 whitespace-nowrap ${col.key === "actions" ? "sticky right-0 z-10 text-center" : ""}`}>
                              {col.render ? col.render(row) : <span className="text-sm">{row[col.key] || "—"}</span>}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={tabContent.columns.length} className="px-2 py-10 text-center text-gray-400">No data found.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            
            <TablePagination
              currentPage={page}
              totalPages={Math.ceil(tabContent.total / limit) || 1}
              limit={limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <AddNoticeDrawer isOpen={isNoticeDrawerOpen} onClose={() => setIsNoticeDrawerOpen(false)} />
      <AddTenderDrawer isOpen={isTenderDrawerOpen} onClose={() => setIsTenderDrawerOpen(false)} />
      <AddEventDrawer isOpen={isEventDrawerOpen} onClose={() => setIsEventDrawerOpen(false)} />
      <AddLeaderDrawer isOpen={isLeaderDrawerOpen} onClose={() => setIsLeaderDrawerOpen(false)} />
      <AddContactDrawer isOpen={isContactDrawerOpen} onClose={() => setIsContactDrawerOpen(false)} />
      <AddDownloadDrawer isOpen={isDownloadDrawerOpen} onClose={() => setIsDownloadDrawerOpen(false)} />
    </div>
  );
}
