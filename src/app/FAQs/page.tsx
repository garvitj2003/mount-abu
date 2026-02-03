"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavigationHeader from "@/components/landing/NavigationHeader";
import Footer from "@/components/landing/Footer";
import { motion, AnimatePresence, Variants } from "motion/react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const faqData = [
  {
    id: 1,
    question: "What types of place information can I access?",
    answer: "You can access a wide range of information related to Mount Abu, including:\n\n• Demographic and geographical data\n• Urban planning and zoning details\n• Services like sanitation, water supply, and public amenities\n• Notices on infrastructure development and public welfare programs\n• Local government schemes and citizen services",
  },
  {
    id: 2,
    question: "How do I stay informed about official events and notices?",
    answer: "You can stay informed through:\n\n• Official Website: Regularly check the Nagar Parisad’s official website for updates.\n• Social Media: Follow Nagar Parisad on social media platforms (Facebook, Twitter, etc.) for real-time updates.\n• Public Notice Boards: Notices are often posted on physical boards in the city.\n• Email/SMS Alerts: Subscribe to alerts for upcoming events and notices.",
  },
  {
    id: 3,
    question: "What kinds of guidelines can I find?",
    answer: "You can find various guidelines related to:\n\n• Construction Regulations: Zoning laws, permits, and safety guidelines for building and renovation projects.\n• Health and Sanitation: Guidelines for waste management, cleanliness, and public health.\n• Property Registration and Taxes: Rules regarding property ownership, tax payments, and land-use regulations.\n• Public Safety: Guidelines on traffic, fire safety, and disaster preparedness.",
  },
  {
    id: 4,
    question: "How do I access tenders?",
    answer: "To access tenders issued by Nagar Parisad, you can:\n\n• Visit the Nagar Parisad’s Official Website for the latest tender announcements.\n• Check the Tender Notice Section where public tenders and contract invitations are listed.\n• Subscribe to Tender Notifications via email or SMS alerts for updates on new tenders.",
  },
  {
    id: 5,
    question: "What documents do I need to upload for a construction application/token?",
    answer: "For a construction application or token, you will typically need:\n\n• Property Ownership Documents (Sale Deed, Title Deed, etc.)\n• Building Plan approved by an architect or engineer\n• NOC (No Objection Certificate) from local authorities if required\n• Land Use Certificate (if applicable)\n• Identity and Address Proof of the applicant\n• Affidavit for legal compliance (if necessary)\n• Payment Receipt of applicable fees",
  },
  {
    id: 6,
    question: "How do I file a complaint?",
    answer: "To file a complaint, you can:\n\n• Visit the Nagar Parisad’s Official Website and use the Complaint Portal to submit your issue.\n• Approach the Nagar Parisad office and fill out a complaint form at the help desk.\n• File a complaint via the Municipal App if available in Mount Abu.\n• Call the Helpline or send an email to the Nagar Parisad for assistance.",
  },
  {
    id: 7,
    question: "How do I track my complaint?",
    answer: "You can track your complaint through:\n\n• Online Portal: Use the Complaint Tracking Section on the Nagar Parisad website to check the status.\n• Municipal App: If available, use the app’s Complaint Tracking Feature.\n• Helpline/Customer Service: Contact the Nagar Parisad’s helpline for real-time updates.",
  },
  {
    id: 8,
    question: "Do I receive notifications for token approvals?",
    answer: "Yes, once your construction application is approved, you will be notified through:\n\n• SMS Alerts to your registered phone number.\n• Email Notifications with the approval details.\n• You can also track the status on the Nagar Parisad Portal or App.",
  },
  {
    id: 9,
    question: "How do I apply for a construction token?",
    answer: "To apply for a construction token:\n\n• Visit the Nagar Parisad website and navigate to the Construction Application section.\n• Submit the required documents and fill out the application form.\n• Pay the applicable fees for token issuance.\n• Once the application is submitted, you’ll receive confirmation and further instructions.",
  },
  {
    id: 10,
    question: "How do I track my construction application?",
    answer: "You can track the status of your construction application through:\n\n• Online Portal: Visit the Construction Application Tracking Section on the Nagar Parisad website.\n• SMS/Email Updates: You will receive updates on the status of your application.\n• Municipal App: Track your application status through the App’s Tracking Feature.",
  },
  {
    id: 11,
    question: "How do I utilize my digital construction token?",
    answer: "Once you receive your digital construction token:\n\n• Download/Print the Token: Download the token from the Nagar Parisad website or app.\n• Use for Approvals: Present the token for required approvals and inspections during construction.\n• Compliance with Regulations: Ensure you adhere to construction rules and regulations while utilizing the token.",
  },
  {
    id: 12,
    question: "What if my token application is objected or rejected?",
    answer: "If your token application is objected or rejected:\n\n• Notification: You will receive a formal notification explaining the reasons for the objection or rejection.\n• Appeal Process: If eligible, you can file an appeal with the Nagar Parisad office, providing additional documents or rectifications.\n• Reapply: Address the issues and reapply for the construction token.",
  },
];

function FAQItem({ item, isOpen, onClick }: { item: any; isOpen: boolean; onClick: () => void }) {
  return (
    <div 
      className={`rounded-[12px] overflow-hidden transition-all duration-300 shadow-sm ${isOpen ? "bg-white" : "bg-[#FFF4DB]"}`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left"
      >
        <span className="font-montserrat font-semibold text-[#333333] text-base md:text-lg pr-4">
          {item.question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}>
          <Image 
            src="/images/nav-next.svg" 
            alt="Toggle" 
            width={32} 
            height={32}
          />
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-0">
              <div className="w-full h-[1px] bg-black/5 mb-4" />
              <p className="font-montserrat font-medium text-[#4C4C4D] text-sm md:text-base leading-relaxed whitespace-pre-line">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQsPage() {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const firstColumn = faqData.slice(0, 6);
  const secondColumn = faqData.slice(6);

  return (
    <div className="min-h-screen bg-[#FFFBEF] flex flex-col font-montserrat">
      <NavigationHeader variant="dark" />

      <main className="flex-grow w-full relative">
        {/* Hero Section */}
        <section className="relative w-full min-h-screen flex flex-col items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/sections/Tenders.png"
              alt="FAQs Background"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative z-10 container mx-auto px-4 md:px-20.5 pt-32 md:pt-40 pb-32">
             
             {/* Header with Back Button */}
             <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="flex items-center gap-6 mb-12"
              >
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <svg
                    width="28"
                    height="23"
                    viewBox="0 0 28 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="block"
                  >
                    <path
                      d="M1.07129 11.1126L26.0713 11.1126"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.1543 21.153L1.07096 11.113L11.1543 1.07129"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="flex items-start gap-2">
                    <h1 className="font-baron leading-none text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        Frequently asked questions
                    </h1>
                    <div className="translate-y-[-10px]">
                        <svg width="40" height="56" viewBox="0 0 76 106" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                            <path d="M26.8066 61.9651L26.3407 59.8476C25.9021 57.8547 25.9265 56.0864 26.4139 54.5427C26.9428 52.9899 27.6743 51.5666 28.6084 50.2728C29.5749 48.9284 30.5551 47.6462 31.549 46.4264C32.5429 45.2065 33.311 43.9493 33.8531 42.6547C34.4368 41.351 34.5597 39.931 34.2216 38.3948C33.7283 36.1528 32.5349 34.5872 30.6416 33.6979C28.7899 32.7996 26.7845 32.5879 24.6255 33.063C23.2554 33.3645 22.0161 33.9636 20.9076 34.8605C19.7991 35.7574 18.992 36.9361 18.4864 38.3968C17.9716 39.8159 17.9289 41.5012 18.3583 43.4526L11.4455 44.9737C10.7054 41.6107 10.8199 38.6691 11.7888 36.1488C12.7901 33.5779 14.3346 31.4969 16.422 29.9058C18.5511 28.3056 20.9027 27.2223 23.4768 26.6558C26.1755 26.062 28.7646 26.0581 31.2442 26.6443C33.7561 27.1797 35.9164 28.2932 37.725 29.9846C39.5752 31.6668 40.8018 33.8781 41.4047 36.6183C41.8798 38.7773 41.8712 40.7162 41.3788 42.4351C40.8774 44.1125 40.148 45.6442 39.1906 47.0301C38.2332 48.4161 37.2622 49.7397 36.2774 51.0011C35.2835 52.221 34.481 53.4205 33.8699 54.5997C33.3003 55.7697 33.1571 56.9983 33.4403 58.2853L33.9063 60.4028L26.8066 61.9651ZM33.2692 74.124C32.0236 74.3981 30.9151 74.2067 29.9435 73.5499C28.9628 72.8516 28.3491 71.942 28.1024 70.821C27.8375 69.617 28.008 68.513 28.6142 67.509C29.2203 66.505 30.1461 65.866 31.3917 65.5919C32.5957 65.327 33.6835 65.5229 34.6551 66.1797C35.6682 66.8273 36.3072 67.7532 36.5722 68.9572C36.828 70.1197 36.6321 71.2076 35.9844 72.2206C35.3783 73.2246 34.4732 73.8591 33.2692 74.124Z" fill="white"/>
                            <path d="M45.2761 75.4047L45.8842 74.0663C46.4566 72.8067 47.1888 71.8572 48.0808 71.2178C48.9992 70.5903 49.9747 70.1154 51.0076 69.7933C52.0786 69.4568 53.1318 69.1596 54.167 68.9018C55.2023 68.6441 56.1302 68.2742 56.9507 67.7922C57.7975 67.3222 58.4415 66.6017 58.8826 65.6307C59.5265 64.2136 59.5156 62.879 58.8499 61.6267C58.2104 60.3863 57.2084 59.4562 55.8438 58.8361C54.9778 58.4426 54.0618 58.2639 53.0957 58.2998C52.1296 58.3357 51.2124 58.6471 50.3442 59.2341C49.4879 59.7948 48.7795 60.6918 48.2191 61.9252L43.8498 59.9399C44.8156 57.8143 46.0738 56.2648 47.6242 55.2913C49.2128 54.3035 50.8968 53.8023 52.6764 53.7877C54.4822 53.7851 56.1986 54.1534 57.8256 54.8927C59.5313 55.6677 60.9377 56.7183 62.0447 58.0445C63.1899 59.3563 63.9093 60.8388 64.203 62.4919C64.5229 64.1569 64.2893 65.8554 63.5024 67.5873C62.8823 68.9519 62.0893 70.0004 61.1233 70.7329C60.1692 71.4391 59.1507 71.9736 58.0677 72.3364C56.9848 72.6991 55.9197 73.0225 54.8726 73.3065C53.8373 73.5643 52.9142 73.8888 52.1032 74.2802C51.3184 74.6834 50.7412 75.2918 50.3716 76.1053L49.7635 77.4436L45.2761 75.4047ZM43.839 84.6295C43.0517 84.2718 42.528 83.7172 42.2679 82.9658C42.0197 82.1882 42.0566 81.4451 42.3785 80.7366C42.7243 79.9756 43.2657 79.4459 44.0028 79.1477C44.7399 78.8494 45.502 78.8791 46.2893 79.2368C47.0503 79.5826 47.5609 80.1312 47.821 80.8825C48.1073 81.6459 48.0776 82.408 47.7318 83.169C47.398 83.9038 46.8494 84.4144 46.0861 84.7007C45.349 84.999 44.6 84.9753 43.839 84.6295Z" fill="white"/>
                        </svg>
                    </div>
                </div>
              </motion.div>

              {/* Accordions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                 <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-6"
                 >
                    {firstColumn.map((item) => (
                        <FAQItem 
                            key={item.id} 
                            item={item} 
                            isOpen={openId === item.id} 
                            onClick={() => toggleFAQ(item.id)} 
                        />
                    ))}
                 </motion.div>

                 <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-6"
                 >
                    {secondColumn.map((item) => (
                        <FAQItem 
                            key={item.id} 
                            item={item} 
                            isOpen={openId === item.id} 
                            onClick={() => toggleFAQ(item.id)} 
                        />
                    ))}
                 </motion.div>
              </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 w-full z-20 translate-y-1">
             <Image
                src="/images/wave-bottom.svg"
                alt=""
                width={1920}
                height={100}
                className="w-full h-auto object-cover"
             />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
