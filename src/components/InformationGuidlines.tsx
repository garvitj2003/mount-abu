import Image from "next/image";

type ButtonVariant = "red" | "green" | "blue" | "olive";

interface CardProps {
  title: string;
  buttonText: string;
  buttonVariant: ButtonVariant;
  href?: string;
}

const buttonColors: Record<ButtonVariant, string> = {
  red: "rgba(255, 0, 4, 0.29)",
  green: "rgba(0, 255, 0, 0.29)",
  blue: "rgba(0, 34, 255, 0.29)",
  olive: "rgba(180, 180, 0, 0.29)",
};

function Card({ title, buttonText, buttonVariant, href = "#" }: CardProps) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center gap-[6px] rounded-[14px] border-[1.7px] border-[#2d4a2d] overflow-hidden pt-[14px] pb-[18px] px-0 backdrop-blur-[0.5px] transition-transform hover:scale-[1.02]"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(245, 242, 233, 0.06) 0%, rgba(245, 242, 233, 0.06) 100%)",
      }}
    >
      {/* Title */}
      <div className="flex items-center justify-center px-[19px] py-[18px] backdrop-blur-[15px]">
        <h3 className="font-montserrat font-medium text-[24px] text-white text-center leading-[1.25] w-[221px]">
          {title}
        </h3>
      </div>
      {/* Button */}
      <div
        className="flex items-center justify-center px-[3px] py-[10px] rounded-[8px] backdrop-blur-[15px] w-[227px]"
        style={{ backgroundColor: buttonColors[buttonVariant] }}
      >
        <span className="font-montserrat font-medium text-[16px] text-white text-center leading-[1.25]">
          {buttonText}
        </span>
      </div>
    </a>
  );
}

const cardData: CardProps[] = [
  {
    title: "Nagar Palika Act",
    buttonText: "Download PDF",
    buttonVariant: "red",
  },
  {
    title: "Construction Guidelines",
    buttonText: "Download PDF",
    buttonVariant: "green",
  },
  {
    title: "Wards List",
    buttonText: "View Map",
    buttonVariant: "blue",
  },
  {
    title: "Eco Sensitive Zone",
    buttonText: "Download PDF",
    buttonVariant: "red",
  },
  {
    title: "Restaurant Licences",
    buttonText: "Apply Online",
    buttonVariant: "green",
  },
  {
    title: "Land Purchase Guidelines",
    buttonText: "Download PDF",
    buttonVariant: "red",
  },
  {
    title: "Tenders",
    buttonText: "View Tenders",
    buttonVariant: "olive",
  },
  {
    title: "Taxes",
    buttonText: "Download PDF",
    buttonVariant: "green",
  },
  {
    title: "Budget",
    buttonText: "Download PDF",
    buttonVariant: "green",
  },
];

export default function InformationGuidlines() {
  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* Top gradient overlay */}
      <div
        className="absolute top-0 left-0 w-full h-[200px] z-10"
        style={{
          background:
            "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />
      {/* Bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] z-10"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />

      {/* Background color layer */}
      <div className="absolute inset-0 bg-[#132019]" />

      {/* Background Image */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src="/images/sections/Info.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen py-16 px-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <span className="font-montserrat font-medium text-[18px] tracking-[0.2em] uppercase text-[#a3a355]">
            All you need
          </span>
          <h2 className="font-playfair text-[36px] md:text-[42px] text-white text-center">
            Information & Guidelines
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 max-w-[1200px] w-full">
          {cardData.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              buttonText={card.buttonText}
              buttonVariant={card.buttonVariant}
              href={card.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}