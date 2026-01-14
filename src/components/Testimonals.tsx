import Image from "next/image";

export default function Testimonials() {
    return (
        <div className="relative w-screen h-screen bg-none">
          <div className="absolute top-0 left-0 w-full h-[200px] z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, #132019 0%, rgba(19, 32, 25, 0) 100%)" }} />
          <div className="absolute bottom-0 left-0 w-full h-[150px] z-10 pointer-events-none" style={{ background: "linear-gradient(to top, #132019 0%, rgba(19, 32, 25, 0) 100%)" }} />
            <div className="absolute w-full h-full inset-0 bg-none bg-[#132019]">
                <Image
                    src="/images/sections/Leadership.png"
                    fill
                    alt="testimonals"
                    className="object-cover opacity-30"
                />
            </div>
        </div>
    );
}
