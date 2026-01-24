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
    const isExternal = href.startsWith("http");
    return (
        <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="group relative flex flex-col items-center justify-center gap-2 rounded-2xl overflow-hidden pt-4 pb-5 px-4 backdrop-blur-[0.5px] transition-all duration-300 hover:scale-[1.04] bg-white/5"
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-out rotate-12 pointer-events-none z-30 scale-[2.5]" />

            {/* Gradient Border using Mask */}
            <div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    padding: "1.5px",
                    background: "linear-gradient(to top, #D4AF37, #2D4A2D)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "destination-out",
                    maskComposite: "exclude",
                }}
            />

            {/* Title */}
            <div className="flex items-center justify-center px-4 py-4 w-full min-h-[80px]">
                <h3 className="font-montserrat font-medium text-xl md:text-2xl text-white text-center leading-tight max-w-[240px]">
                    {title}
                </h3>
            </div>
            {/* Button */}
            <div
                className="flex items-center justify-center px-2 py-2.5 rounded-lg backdrop-blur-md w-full max-w-[240px]"
                style={{ backgroundColor: buttonColors[buttonVariant] }}
            >
                <span className="font-montserrat font-medium text-sm md:text-base text-white text-center leading-tight">
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
        href: "https://drive.google.com/file/d/1k5A-CDzAPz3xCGLcsETX8F3GYdZZxmVP/view?usp=drivesdk",
    },
    {
        title: "Construction Guidelines",
        buttonText: "Download PDF",
        buttonVariant: "green",
        href: "https://drive.google.com/file/d/1PA4DyI-cEGMtTJCSimeTy-QfZ5QR-e57/view?usp=drivesdk",
    },
    {
        title: "Wards List",
        buttonText: "View Map",
        buttonVariant: "blue",
        href: "https://drive.google.com/file/d/1cJExzDqt1iCDeGogL1rOSnEMN-D56tzz/view?usp=drivesdk",
    },
    {
        title: "Solid Waste Management",
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
        href: "https://drive.google.com/file/d/1k5A-CDzAPz3xCGLcsETX8F3GYdZZxmVP/view?usp=drivesdk",
    },
    {
        title: "Tenders",
        buttonText: "View Tenders",
        buttonVariant: "olive",
        href: "https://eproc.rajasthan.gov.in/nicgep/app",
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
        <section id="info-guidelines" className="relative w-full min-h-screen overflow-hidden bg-[#132019]">
            {/* Top gradient overlay */}
            <div
                className="absolute top-0 left-0 w-full h-48 md:h-64 z-10"
                style={{
                    background:
                        "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />
            {/* Bottom gradient overlay */}
            <div
                className="absolute bottom-0 left-0 w-full h-48 md:h-64 z-10"
                style={{
                    background:
                        "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
                }}
            />

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
            <div className="relative z-20 container mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col items-center justify-center">
                {/* Header */}
                <div className="flex flex-col items-center gap-3 mb-12 md:mb-16">
                    <span className="font-baron  md:text-2xl tracking-tight text-[#a3a355]">
                        All you need
                    </span>
                    <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-white text-center leading-tight">
                        Information & Guidelines
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full">
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
        </section>
    );
}
