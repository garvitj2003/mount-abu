import Image from "next/image";

export default function InformationGuidlines() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-[200px] z-100"
        style={{
          background:
            "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] z-100"
        style={{
          background:
            "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)",
        }}
      />
          {/* Background Image */}
      <div className="bg-[#132019] opacity-90 w-full h-full inset-0"/>
      <div className="absolute inset-0 opacity-40">
        <Image
          src="/images/sections/Info.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}