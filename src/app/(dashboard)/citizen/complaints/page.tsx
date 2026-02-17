"use client";

import { useState } from "react";

import ComplaintsTable from "@/components/dashboard/citizen/complaints/ComplaintsTable";

import NewComplaintDrawer from "@/components/dashboard/citizen/complaints/NewComplaintDrawer";

import ComplaintViewDrawer from "@/components/dashboard/citizen/complaints/ComplaintViewDrawer";



export default function ComplaintsPage() {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);



  const handleComplaintClick = (complaint: any) => {

    setSelectedComplaint(complaint);

    setIsViewDrawerOpen(true);

  };



  return (

    <div className="flex h-full w-full flex-col bg-[#F5F6F7] font-onest">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-[#D6D9DE] bg-white px-8 py-3">

        <div className="flex flex-col gap-1">

          <h1 className="text-lg font-medium text-[#343434]">

            Citizen Complaints

          </h1>

          <p className="text-xs font-normal text-[#343434] opacity-80">

            All service-related complaints, simplified.

          </p>

        </div>

        <button 

          onClick={() => setIsDrawerOpen(true)}

          className="rounded-lg cursor-pointer bg-[#0C83FF] px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"

        >

          New Complain

        </button>

      </div>



      {/* Content */}

      <div className="flex flex-col p-5">

        <ComplaintsTable onComplaintClick={handleComplaintClick} />

      </div>



      {/* New Complaint Drawer */}

      <NewComplaintDrawer 

        isOpen={isDrawerOpen} 

        onClose={() => setIsDrawerOpen(false)} 

      />



      {/* View Complaint Drawer */}

      <ComplaintViewDrawer

        isOpen={isViewDrawerOpen}

        onClose={() => setIsViewDrawerOpen(false)}

        complaint={selectedComplaint}

      />

    </div>

  );

}
