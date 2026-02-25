"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import DropdownSelect from "@/components/ui/DropdownSelect";
import TablePagination from "@/components/ui/TablePagination";
import { useCityProfile, useUpdateCityProfile } from "@/hooks/useCityProfile";
import AddNoticeDrawer from "@/components/dashboard/authority/website-content/AddNoticeDrawer";
import AddTenderDrawer from "@/components/dashboard/authority/website-content/AddTenderDrawer";
import AddEventDrawer from "@/components/dashboard/authority/website-content/AddEventDrawer";
import AddLeaderDrawer from "@/components/dashboard/authority/website-content/AddLeaderDrawer";
import AddContactDrawer from "@/components/dashboard/authority/website-content/AddContactDrawer";
import AddDownloadDrawer from "@/components/dashboard/authority/website-content/AddDownloadDrawer";

type TabType = "Notices" | "Tenders" | "Events" | "Leaders Board" | "Contact Diary" | "City Profile" | "Downloads";

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

// Dummy Data Generators
const generateNotices = () => [
  { id: 1, title: "Guidelines for New Construction Applications", type: "Public Notice", published_on: "01 Oct 2025", valid_till: "—", status: "Active", visibility: "Public" },
  { id: 2, title: "Temporary Closure of Delwara Road", type: "Traffic Advisory", published_on: "03 Oct 2025", valid_till: "06 Oct 2025", status: "Active", visibility: "Public" },
  { id: 3, title: "Revised Fees for Renovation Applications", type: "Circular", published_on: "15 Sep 2025", valid_till: "—", status: "Active", visibility: "Public" },
  { id: 4, title: "Maintenance Work at Nakki Lake Area", type: "Public Information", published_on: "05 Sep 2025", valid_till: "07 Sep 2025", status: "Expired", visibility: "Public" },
  { id: 5, title: "Internal Review Meeting – Engineering Department", type: "Internal Notice", published_on: "20 Sep 2025", valid_till: "20 Sep 2025", status: "Inactive", visibility: "Internal" },
];

const generateTenders = () => [
  { id: "MAP/ENG/2025/01", title: "Construction of Public Toilets at Nakki Lake", department: "Engineering", amount: "50 Cr", published_on: "01 Oct 2025", deadline: "20 Oct 2025", status: "Active" },
  { id: "MAP/ENG/2025/02", title: "Road Repair & Resurfacing – Delwara Road", department: "Engineering", amount: "33 Cr", published_on: "28 Sep 2025", deadline: "18 Oct 2025", status: "Active" },
  { id: "MAP/ULB/2025/03", title: "Renovation of Municipal Office Building", department: "ULB", amount: "138 Cr", published_on: "15 Sep 2025", deadline: "10 Oct 2025", status: "Closed" },
  { id: "MAP/ENG/2025/04", title: "Supply of Electrical Fixtures for Street Lighting", department: "Engineering", amount: "8 Cr", published_on: "05 Sep 2025", deadline: "25 Sep 2025", status: "Expired" },
  { id: "MAP/ULB/2025/05", title: "AMC for Solid Waste Collection Vehicles", department: "ULB", amount: "95 Lacs", published_on: "10 Sep 2025", deadline: "30 Sep 2025", status: "Cancelled" }
];

const generateEvents = () => [
  { id: 1, title: "Summer Festival 2025", type: "Cultural", date: "15 May 2025", time: "10:00 AM", location: "Nakki Lake", status: "Upcoming" },
  { id: 2, title: "Eco-Mount Abu Awareness Drive", type: "Environmental", date: "22 Apr 2025", time: "08:00 AM", location: "Main Market", status: "Completed" }
];

const generateLeaders = () => [
  { id: 1, name: "Shri Mahant Ji", designation: "Chairman", department: "Administration", status: "Active" },
  { id: 2, name: "Smt. Sharda Devi", designation: "Vice Chairman", department: "Administration", status: "Active" }
];

const generateContacts = () => [
  { id: 1, name: "Rajesh Kumar", designation: "Head Clerk", department: "Revenue", mobile: "+91 9876543210", email: "rajesh@mountabu.gov.in", status: "Active" }
];

const generateCityProfile = () => [
  { id: 1, section: "History", description: "Brief history of Mount Abu municipality...", updated_at: "01 Jan 2025", status: "Published" }
];

const generateDownloads = () => [
  { id: 1, title: "Building Bylaws 2024", category: "Guidelines", type: "PDF", size: "2.4 MB", uploaded_at: "10 Dec 2024", status: "Active" }
];

const RenderStatus = (status: string) => {
  const isDanger = ["Expired", "Inactive", "Cancelled", "Closed", "Rejected"].includes(status);
  const isWarning = ["Upcoming", "Pending"].includes(status);
  
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
      <span className={`text-sm font-normal ${textColor}`}>{status}</span>
    </div>
  );
};

const RenderActions = () => (
  <div className="text-center">
      <button className="text-[#343434] hover:bg-gray-200 rounded p-1 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 8.66667C13.7015 8.66667 14 8.36819 14 8C14 7.63181 13.7015 7.33333 13.3333 7.33333C12.9651 7.33333 12.6667 7.63181 12.6667 8C12.6667 8.36819 12.9651 8.66667 13.3333 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.66667 8.66667C3.03486 8.66667 3.33333 8.36819 3.33333 8C3.33333 7.63181 3.03486 7.33333 2.66667 7.33333C2.29848 7.33333 2 7.63181 2 8C2 8.36819 2.29848 8.66667 2.66667 8.66667Z" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
      </button>
  </div>
);

const NOTICE_COLUMNS: TableColumn[] = [
  { header: "Notice Title", key: "title", render: (row) => <span className="text-sm font-normal text-[#0C83FF] underline decoration-solid cursor-pointer">{row.title}</span> },
  { header: "Notice Type", key: "type" },
  { header: "Published On", key: "published_on" },
  { header: "Valid Till", key: "valid_till" },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { 
    header: "Visibility", 
    key: "visibility",
    render: (row) => {
      const isInternal = row.visibility === "Internal";
      return (
        <div className="flex items-center gap-1.5">
           { !isInternal ? (
             <Image src="/dashboard/icons/applications/visibility-public.svg" alt="Public" width={20} height={20} />
           ) : (
             <Image src="/dashboard/icons/applications/visibility-internal.svg" alt="Internal" width={20} height={20} />
           )}
          <span className={`text-sm font-normal ${isInternal ? "text-[#F35C86]" : "text-[#404B86]"}`}>
            {row.visibility}
          </span>
        </div>
      );
    }
  },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

const TENDER_COLUMNS: TableColumn[] = [
  { header: "Tender Title", key: "title", render: (row) => <span className="text-sm font-normal text-[#0C83FF] underline decoration-solid cursor-pointer">{row.title}</span> },
  { header: "Tender ID", key: "id" },
  { header: "Department", key: "department" },
  { header: "Tender Amount", key: "amount" },
  { header: "Published On", key: "published_on" },
  { header: "Submission Deadline", key: "deadline" },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

const EVENT_COLUMNS: TableColumn[] = [
  { header: "Event Title", key: "title", render: (row) => <span className="text-sm font-normal text-[#0C83FF] underline decoration-solid cursor-pointer">{row.title}</span> },
  { header: "Event Type", key: "type" },
  { header: "Date", key: "date" },
  { header: "Time", key: "time" },
  { header: "Location", key: "location" },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

const LEADERS_COLUMNS: TableColumn[] = [
  { header: "Name", key: "name", render: (row) => <span className="text-sm font-normal text-[#0C83FF] underline decoration-solid cursor-pointer">{row.name}</span> },
  { header: "Designation", key: "designation" },
  { header: "Department", key: "department" },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

const CONTACT_COLUMNS: TableColumn[] = [
  { header: "Name", key: "name", render: (row) => <span className="text-sm font-normal text-[#0C83FF] underline decoration-solid cursor-pointer">{row.name}</span> },
  { header: "Designation", key: "designation" },
  { header: "Department", key: "department" },
  { header: "Mobile Number", key: "mobile" },
  { header: "Email", key: "email" },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

const CITY_PROFILE_COLUMNS: TableColumn[] = [
  { header: "Section Name", key: "section", render: (row) => <span className="text-sm font-normal text-[#0C83FF] underline decoration-solid cursor-pointer">{row.section}</span> },
  { header: "Description", key: "description" },
  { header: "Last Updated", key: "updated_at" },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

const DOWNLOAD_COLUMNS: TableColumn[] = [
  { header: "Document Title", key: "title", render: (row) => <span className="text-sm font-normal text-[#0C83FF] underline decoration-solid cursor-pointer">{row.title}</span> },
  { header: "Category", key: "category" },
  { header: "File Type", key: "type" },
  { header: "File Size", key: "size" },
  { header: "Uploaded On", key: "uploaded_at" },
  { header: "Status", key: "status", render: (row) => RenderStatus(row.status) },
  { header: "", key: "actions", width: "40px", render: () => RenderActions() }
];

export default function AuthorityWebsiteContentPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Notices");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Drawer States
  const [isNoticeDrawerOpen, setIsNoticeDrawerOpen] = useState(false);
  const [isTenderDrawerOpen, setIsTenderDrawerOpen] = useState(false);
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);
  const [isLeaderDrawerOpen, setIsLeaderDrawerOpen] = useState(false);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [isDownloadDrawerOpen, setIsDownloadDrawerOpen] = useState(false);

  // City Profile Data (DUMMY for now)
  const cityProfile = {
    area_sq_km: "21.64 sq. km",
    no_of_wards: 25,
    ward_boundaries: "21.64 sq. km",
    population_estimate: 25,
    rental_properties_of_corporation: 25,
    number_of_slums: 0,
    solid_waste_per_day: "9.1 Tones",
    street_light_poles: 150,
    employees_in_board: 135,
    households_residential: 4500,
    households_shops_offices: 550,
    households_open_plots: 0,
    birth_registration_per_year: 800,
    birth_certificate_per_year: 900
  };
  const isLoadingProfile = false;
  // const { data: cityProfile, isLoading: isLoadingProfile } = useCityProfile();
  const updateProfile = { isPending: false }; // Mocked mutation state

  // City Profile Form States (Initialized with strings to ensure controlled inputs)
  const [profileForm, setProfileForm] = useState({
    area_sq_km: "21.64 sq. km",
    no_of_wards: "25",
    ward_boundaries: "21.64 sq. km",
    population_estimate: "25",
    rental_properties_of_corporation: "25",
    number_of_slums: "0",
    solid_waste_per_day: "9.1 Tones",
    street_light_poles: "150",
    employees_in_board: "135",
    households_residential: "4500",
    households_shops_offices: "550",
    households_open_plots: "0",
    birth_registration_per_year: "800",
    birth_certificate_per_year: "900"
  });

  // Sync effect removed to avoid controlled input warnings and cascading renders

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
      // Convert to number if the field is expected to be a number in schema
      if (["no_of_wards", "population_estimate", "rental_properties_of_corporation", "number_of_slums", "street_light_poles", "employees_in_board", "households_residential", "households_shops_offices", "households_open_plots", "birth_registration_per_year", "birth_certificate_per_year"].includes(field)) {
        updateData[field] = value === "" ? null : Number(value);
      } else {
        updateData[field] = value === "" ? null : value;
      }
    });

    try {
      // await updateProfile.mutateAsync(updateData); // Commented out due to CORS/trailing slash issues
      alert("Dummy Save: Changes would be saved to backend.");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to save changes.");
    }
  };

  // Filter States
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | number | null>(null);
  const [status, setStatus] = useState<string | number | null>(null);
  const [page, setPage] = useState(1);
  const [showRightShadow, setShowRightShadow] = useState(false);
  const limit = 10;

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

  useEffect(() => {
    const timer = setTimeout(checkScroll, 0);
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
    };
  }, [activeTab]);

  const getTabData = () => {
    switch (activeTab) {
      case "Tenders":
        return { 
          columns: TENDER_COLUMNS, 
          data: generateTenders(),
          typeLabel: "Departments",
          typeOptions: [
            { label: "Engineering", value: "Engineering" },
            { label: "ULB", value: "ULB" },
          ]
        };
      case "Events":
        return { 
          columns: EVENT_COLUMNS, 
          data: generateEvents(),
          typeLabel: "Event Type",
          typeOptions: [
            { label: "Cultural", value: "Cultural" },
            { label: "Sports", value: "Sports" },
            { label: "Awareness", value: "Awareness" },
          ]
        };
      case "Leaders Board":
        return { 
          columns: LEADERS_COLUMNS, 
          data: generateLeaders(),
          typeLabel: "Departments",
          typeOptions: [
            { label: "Administration", value: "Administration" },
          ]
        };
      case "Contact Diary":
        return { 
          columns: CONTACT_COLUMNS, 
          data: generateContacts(),
          typeLabel: "Departments",
          typeOptions: [
            { label: "Revenue", value: "Revenue" },
            { label: "Engineering", value: "Engineering" },
          ]
        };
      case "City Profile":
        return { 
          columns: CITY_PROFILE_COLUMNS, 
          data: generateCityProfile(),
          typeLabel: "Category",
          typeOptions: []
        };
      case "Downloads":
        return { 
          columns: DOWNLOAD_COLUMNS, 
          data: generateDownloads(),
          typeLabel: "Category",
          typeOptions: [
            { label: "Guidelines", value: "Guidelines" },
            { label: "Forms", value: "Forms" },
          ]
        };
      case "Notices":
      default:
        return { 
          columns: NOTICE_COLUMNS, 
          data: generateNotices(),
          typeLabel: "Notice Type",
          typeOptions: [
            { label: "Public Notice", value: "Public Notice" },
            { label: "Circular", value: "Circular" },
          ]
        };
    }
  };

  const { columns, data, typeLabel, typeOptions } = getTabData();

  return (
    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-5 py-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-base font-medium text-[#343434]">Website Content Management</h1>
          <p className="text-xs font-normal text-[#343434]">
            Create and manage system users, assign roles, and control access across municipal operations.
          </p>
        </div>
        {activeTab !== "City Profile" && (
          <button 
            onClick={() => {
              if (activeTab === "Notices") setIsNoticeDrawerOpen(true);
              if (activeTab === "Tenders") setIsTenderDrawerOpen(true);
              if (activeTab === "Events") setIsEventDrawerOpen(true);
              if (activeTab === "Leaders Board") setIsLeaderDrawerOpen(true);
              if (activeTab === "Contact Diary") setIsContactDrawerOpen(true);
              if (activeTab === "Downloads") setIsDownloadDrawerOpen(true);
            }}
            className="flex items-center justify-center gap-2.5 rounded-lg bg-[#0C83FF] px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            {activeTab === "Notices" ? "Add New Notice" :
             activeTab === "Tenders" ? "Add New Tender" :
             activeTab === "Events" ? "Add New Event" :
             activeTab === "Downloads" ? "Add New Download" :
             activeTab === "Leaders Board" ? "Add New Leader" :
             activeTab === "Contact Diary" ? "Add New Contact" :
             `Manage ${activeTab}`}
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
              setTypeFilter(null);
              setStatus(null);
            }}
            className={`flex items-center justify-center gap-2.5 px-3 py-2 text-sm transition-colors whitespace-nowrap ${
              activeTab === tab ? "font-semibold text-[#0C83FF]" : "font-normal text-[#343434]"
            }`}
          >
            {tab}
          </button>
        ))}
        {/* Active Tab Indicator */}
        <div 
          className="absolute bottom-0 h-1.5 rounded-t-lg bg-[#0C83FF] transition-all duration-300"
          style={{
            width: `${indicatorStyle.width}px`,
            left: `${indicatorStyle.left}px`
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {activeTab === "City Profile" ? (
          isLoadingProfile ? (
            <div className="flex h-64 w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0C83FF] border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Column 1: City Profile */}
              <div className="flex flex-col gap-6 bg-white border border-[#D6D9DE] p-5 rounded-lg shadow-sm">
                <div className="flex justify-between items-center border-b border-[#D6D9DE] pb-3">
                  <h2 className="text-lg font-medium text-[#343434]">City Profile</h2>
                  <button 
                    disabled={!isCardChanged(["area_sq_km", "no_of_wards", "ward_boundaries", "population_estimate", "rental_properties_of_corporation", "number_of_slums", "solid_waste_per_day", "street_light_poles", "employees_in_board"]) || updateProfile.isPending}
                    onClick={() => handleSave(["area_sq_km", "no_of_wards", "ward_boundaries", "population_estimate", "rental_properties_of_corporation", "number_of_slums", "solid_waste_per_day", "street_light_poles", "employees_in_board"])}
                    className="bg-[#0C83FF] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {updateProfile.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Area In Sq. km.</label>
                    <input 
                      type="text" 
                      value={profileForm.area_sq_km} 
                      onChange={(e) => handleProfileChange("area_sq_km", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">No. of wards</label>
                    <input 
                      type="text" 
                      value={profileForm.no_of_wards} 
                      onChange={(e) => handleProfileChange("no_of_wards", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Ward boundries</label>
                    <input 
                      type="text" 
                      value={profileForm.ward_boundaries} 
                      onChange={(e) => handleProfileChange("ward_boundaries", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Population estimate</label>
                    <input 
                      type="text" 
                      value={profileForm.population_estimate} 
                      onChange={(e) => handleProfileChange("population_estimate", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-normal text-[#343434]">Rental Properties of corporation</label>
                  <input 
                    type="text" 
                    value={profileForm.rental_properties_of_corporation} 
                    onChange={(e) => handleProfileChange("rental_properties_of_corporation", e.target.value)}
                    className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Number of Slums</label>
                    <input 
                      type="text" 
                      value={profileForm.number_of_slums} 
                      onChange={(e) => handleProfileChange("number_of_slums", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Solid waste per day</label>
                    <input 
                      type="text" 
                      value={profileForm.solid_waste_per_day} 
                      onChange={(e) => handleProfileChange("solid_waste_per_day", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Street Light poles</label>
                    <input 
                      type="text" 
                      value={profileForm.street_light_poles} 
                      onChange={(e) => handleProfileChange("street_light_poles", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Employees in board</label>
                    <input 
                      type="text" 
                      value={profileForm.employees_in_board} 
                      onChange={(e) => handleProfileChange("employees_in_board", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                </div>
              </div>

              {/* Column 2: No of House holds */}
              <div className="flex flex-col gap-6 bg-white border border-[#D6D9DE] p-5 rounded-lg shadow-sm">
                <div className="flex justify-between items-center border-b border-[#D6D9DE] pb-3">
                  <h2 className="text-base font-semibold text-[#343434]">No of House holds</h2>
                  <button 
                    disabled={!isCardChanged(["households_residential", "households_shops_offices", "households_open_plots"]) || updateProfile.isPending}
                    onClick={() => handleSave(["households_residential", "households_shops_offices", "households_open_plots"])}
                    className="bg-[#0C83FF] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {updateProfile.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
                
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Residential</label>
                    <input 
                      type="text" 
                      value={profileForm.households_residential} 
                      onChange={(e) => handleProfileChange("households_residential", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Shops & Offices</label>
                    <input 
                      type="text" 
                      value={profileForm.households_shops_offices} 
                      onChange={(e) => handleProfileChange("households_shops_offices", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Open Plots</label>
                    <input 
                      type="text" 
                      value={profileForm.households_open_plots} 
                      onChange={(e) => handleProfileChange("households_open_plots", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
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
                    className="bg-[#0C83FF] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {updateProfile.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
                
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Registration per year</label>
                    <input 
                      type="text" 
                      value={profileForm.birth_registration_per_year} 
                      onChange={(e) => handleProfileChange("birth_registration_per_year", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-normal text-[#343434]">Certificate per year</label>
                    <input 
                      type="text" 
                      value={profileForm.birth_certificate_per_year} 
                      onChange={(e) => handleProfileChange("birth_certificate_per_year", e.target.value)}
                      className="w-full rounded-lg border border-[#D6D9DE] px-3 py-2 text-sm text-[#343434] outline-none focus:border-[#0C83FF]" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-4 rounded-lg border border-[#D6D9DE] bg-white p-4 min-h-[400px]">
            {/* Filters Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Search */}
              <div className="flex w-[209px] items-center gap-2.5 rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 h-9">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60 shrink-0">
                  <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 14L11.1 11.1" stroke="#343434" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-none bg-transparent p-0 text-sm text-[#343434] outline-none placeholder:opacity-60 focus:ring-0" 
                />
              </div>

              {/* Dropdowns & Date */}
              <div className="flex items-center gap-2 h-9">
                  {/* Dropdowns */}
                  <div className="w-[160px] h-full">
                      <DropdownSelect
                          options={typeOptions}
                          value={typeFilter}
                          onChange={setTypeFilter}
                          placeholder={typeLabel}
                          className="h-full"
                      />
                  </div>

                  <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

                  <div className="w-[140px] h-full">
                      <DropdownSelect
                          options={[
                              { label: "Active", value: "Active" },
                              { label: "Expired", value: "Expired" },
                              { label: "Closed", value: "Closed" },
                              { label: "Cancelled", value: "Cancelled" },
                              { label: "Upcoming", value: "Upcoming" },
                              { label: "Completed", value: "Completed" },
                              { label: "Published", value: "Published" },
                          ]}
                          value={status}
                          onChange={setStatus}
                          placeholder="All Status"
                          className="h-full"
                      />
                  </div>

                  <div className="h-6 w-[1px] bg-[#D6D9DE] mx-1"></div>

                  {/* Date Range */}
                  <div className="flex items-center gap-2 h-full">
                      <div className="flex w-[124px] h-full items-center justify-between rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 cursor-pointer">
                          <span className="text-sm text-[#343434] opacity-60">From</span>
                          <Image src="/dashboard/icons/applications/calendar.svg" alt="calendar" width={18} height={18} className="opacity-60" />
                      </div>
                      <span className="text-[#343434]">-</span>
                      <div className="flex w-[124px] h-full items-center justify-between rounded-lg border border-[#D6D9DE] bg-white px-3 py-2 cursor-pointer">
                          <span className="text-sm text-[#343434] opacity-60">To</span>
                          <Image src="/dashboard/icons/applications/calendar.svg" alt="calendar" width={18} height={18} className="opacity-60" />
                      </div>
                  </div>
              </div>
            </div>

            {/* Table */}
            <div 
              ref={tableContainerRef}
              onScroll={checkScroll}
              className="w-full overflow-x-auto [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#D6D9DE] [&::-webkit-scrollbar-thumb]:rounded-full"
            >
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    {columns.map((col, idx) => (
                      <th 
                        key={idx} 
                        className={`px-2 py-3 text-left bg-white border-b border-[#D6D9DE] ${col.key === "actions" ? "sticky right-0 z-20" : ""}`}
                      >
                        <div className={`flex items-center gap-2 ${idx < columns.length - 1 && col.key !== "actions" ? "border-r border-[rgba(0,0,0,0.1)]" : ""} pr-2`}>
                          <span className="text-xs font-semibold text-[#333333] opacity-70 uppercase whitespace-nowrap">{col.header}</span>
                        </div>
                        {col.key === "actions" && showRightShadow && <div className="absolute inset-y-0 left-0 w-px bg-[#D6D9DE] shadow-[-2px_0_4px_rgba(0,0,0,0.05)]" />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                      {columns.map((col, colIdx) => (
                        <td 
                          key={colIdx} 
                          className={`px-2 py-3 border-b border-[#D6D9DE] bg-white group-hover:bg-gray-50 whitespace-nowrap ${col.key === "actions" ? "sticky right-0 z-10" : ""}`}
                        >
                          {col.key === "actions" && showRightShadow && <div className="absolute inset-y-0 left-0 w-px bg-[#D6D9DE] shadow-[-2px_0_4px_rgba(0,0,0,0.05)]" />}
                          {col.render ? (
                            col.render(row)
                          ) : (
                            <span className={`text-sm ${colIdx === 0 ? "font-medium" : "font-normal text-[#343434] ${colIdx > 0 ? 'opacity-70' : ''}"}`}>
                              {row[col.key] || "—"}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <TablePagination
              currentPage={page}
              totalPages={Math.ceil(data.length / limit)}
              limit={limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
      <AddNoticeDrawer 
        isOpen={isNoticeDrawerOpen}
        onClose={() => setIsNoticeDrawerOpen(false)}
      />
      <AddTenderDrawer 
        isOpen={isTenderDrawerOpen}
        onClose={() => setIsTenderDrawerOpen(false)}
      />
      <AddEventDrawer 
        isOpen={isEventDrawerOpen}
        onClose={() => setIsEventDrawerOpen(false)}
      />
      <AddLeaderDrawer 
        isOpen={isLeaderDrawerOpen}
        onClose={() => setIsLeaderDrawerOpen(false)}
      />
      <AddContactDrawer 
        isOpen={isContactDrawerOpen}
        onClose={() => setIsContactDrawerOpen(false)}
      />
      <AddDownloadDrawer 
        isOpen={isDownloadDrawerOpen}
        onClose={() => setIsDownloadDrawerOpen(false)}
      />
    </div>
  );
}
