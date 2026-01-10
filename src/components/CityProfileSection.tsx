"use client";

// Area statistics data
const areaStats = [
  { label: "Area In Sq. km.", value: "21.64 sq. km" },
  { label: "No. of wards", value: "25" },
  { label: "Population estimate", value: "30,545" },
  { label: "Ward boundries", value: "Attached", isLink: true },
  { label: "Rental Properties of corporation", value: "25" },
  { label: "Number of Slums", value: "0" },
  { label: "Solid waste per day", value: "9.1 Tones" },
  { label: "Street Light poles", value: "150" },
  { label: "No. of employee in the municipal board", value: "135" },
];

// House holds data
const houseHoldsStats = [
  { label: "Residential", value: "4500" },
  { label: "Shops & Offices", value: "550" },
  { label: "Open Plots", value: "0" },
];

// Birth/Death data
const birthDeathStats = [
  { label: "Registration per year", value: "800" },
  { label: "Certificate per year", value: "900" },
];

// Stat row component
function StatRow({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-center justify-between w-full font-poppins text-[24px] text-[#f5f2e9]">
      <p className="leading-normal whitespace-nowrap">{label}</p>
      {isLink ? (
        <p className="leading-[20px] whitespace-nowrap text-[#d4af37] underline cursor-pointer">
          {value}
        </p>
      ) : (
        <p className="leading-[20px] whitespace-nowrap">{value}</p>
      )}
    </div>
  );
}

// Card component
function StatCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-[#d4af37] rounded-[24px] p-[20px] ${className}`}
      style={{
        background: "rgba(0, 0, 0, 0.08)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      {title && (
        <div className="flex items-start justify-between w-full mb-[18px]">
          <p className="font-poppins font-medium text-[24px] text-[#f5f2e9] leading-normal">
            {title}
          </p>
        </div>
      )}
      {children}
    </div>
  );
}

export default function CityProfileSection() {
  return (
    <section className="relative w-full min-h-[800px] bg-[#17261e] overflow-hidden">
      {/* Background Image - Brahma Kumari */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[rgba(81,73,51,0.6)]" />
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/brahma-kumari-bg.png')",
          }}
        />
      </div>

      {/* Gradient overlays */}
      <div
        className="absolute top-0 left-0 w-full h-[200px]"
        style={{
          background:
            "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[200px]"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-[1245px] mx-auto py-[80px] px-[20px]">
        {/* Title Section */}
        <div className="flex flex-col items-center gap-[26px] text-center mb-[60px]">
          <p className="font-baron text-[24px] text-[#d4af37] leading-normal">
            CITY PROFILE
          </p>
          <h2 className="font-poppins font-medium text-[40px] text-white capitalize leading-[54px]">
            Mount Abu and its environment
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="relative w-full h-[606px]">
          {/* Left large card - Area stats */}
          <StatCard className="absolute left-0 top-0 w-[622px] h-full flex flex-col items-center justify-center">
            <div className="flex flex-col gap-[30px] w-full">
              {areaStats.map((stat, index) => (
                <StatRow
                  key={index}
                  label={stat.label}
                  value={stat.value}
                  isLink={stat.isLink}
                />
              ))}
            </div>
          </StatCard>

          {/* Top right card - House holds */}
          <StatCard
            title="No of House holds"
            className="absolute left-[652px] top-0 w-[593px] h-[312px] flex flex-col gap-[18px] items-center justify-center py-[30px]"
          >
            <div className="flex flex-col gap-[18px] w-full">
              {houseHoldsStats.map((stat, index) => (
                <StatRow key={index} label={stat.label} value={stat.value} />
              ))}
            </div>
          </StatCard>

          {/* Bottom right card - Birth/Death */}
          <StatCard
            title="Birth/Death"
            className="absolute left-[652px] top-[342px] w-[591px] h-[264px] flex flex-col gap-[18px] items-center justify-center py-[30px]"
          >
            <div className="flex flex-col gap-[18px] w-full">
              {birthDeathStats.map((stat, index) => (
                <StatRow key={index} label={stat.label} value={stat.value} />
              ))}
            </div>
          </StatCard>
        </div>
      </div>
    </section>
  );
}
