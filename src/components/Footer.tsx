"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Phone,
    Mail,
    MapPin,
    Instagram,
    Facebook,
    Twitter,
    Youtube,
} from "lucide-react";

const adventureLinks = [
    "Monuments",
    "Trek",
    "Religious Places",
    "Important Places",
    "Hotels",
    "Hospital",
    "Fairs and Festivals",
    "Water Bodies",
    "Water Point",
    "Parking",
    "Schools & Institutes",
    "Rock Climbing",
    "Market",
];

const quickLinks = [
    "Administrative Office",
    "Rajasthan Sampark",
    "Pehchan",
    "Eproc",
    "Other govt. Links",
    "Notices",
    "Tenders",
    "Complaints",
    "Digital Construction Token",
    "Emergency contacts",
];

const connectLinks = ["About Us", "Contact Us"];

export default function Footer() {
    return (
        <footer className="relative w-full bg-[#F5F2E9] text-[#1a1a1a] font-montserrat">
            {/* Top Vector Curve */}
            <div className="absolute top-0 w-full h-[85px] -mt-[60px] z-20 pointer-events-none">
                <Image
                    src="/images/footer/vector-top.svg"
                    alt=""
                    fill
                    className="object-cover"
                />
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0">
                <Image
                    src="/images/footer/bg-pattern.png"
                    alt=""
                    fill
                    className="object-cover"
                />
            </div>

            <div className="relative z-10 w-full px-6 pt-12 pb-8 lg:px-12 xl:px-20 max-w-[1600px] mx-auto">
                {/* Main Grid Layout: 12 Columns */}
                {/* Col 1 gets 4 spans (wider), others get remaining space */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-8 xl:gap-x-12">
                    {/* --- COLUMN 1: Logo, Socials, Description (Span 4) --- */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Logo */}
                        <div className="relative w-[180px] h-[100px] lg:w-[220px] lg:h-[110px]">
                            <Image
                                src="/images/footer/logo.png"
                                alt="Nagar Palika Mount Abu"
                                fill
                                className="object-contain object-left"
                            />
                        </div>

                        {/* Social Icons (Added based on image) */}
                        <div className="flex items-center gap-4 text-black">
                            <Link
                                href="https://www.instagram.com/np.mountabu?igsh=MTE3bW9sd3B2eW1vMw%3D%3D&utm_source=qr"
                                className="hover:text-black/70 transition-colors"
                            >
                                <Instagram size={20} />
                            </Link>
                            <Link
                                href="https://www.facebook.com/share/1CwEH7SrJq/?mibextid=wwXIfr"
                                className="hover:text-black/70 transition-colors"
                            >
                                <Facebook size={20} />
                            </Link>
                            <Link
                                href="https://x.com/npmountabu?s=21&t=xT07g2afJhAy8mov76WXzg"
                                className="hover:text-black/70 transition-colors"
                            >
                                <Twitter size={20} />
                            </Link>
                            <Link
                                href="https://youtube.com/@np.mountabu?si=vtjs6kTlEcNC1OM4"
                                className="hover:text-black/70 transition-colors"
                            >
                                <Youtube size={20} />
                            </Link>
                        </div>

                        {/* Description */}
                        <div className="text-[13px] leading-relaxed text-black text-justify pr-0 lg:pr-8">
                            <p className="mb-4">
                                The Nagar Palika Mount Abu is the Local
                                Governing Body Responsible For The
                                Administration And Development Of The Hill
                                Station. Located Near The Polo Ground, It
                                Oversees Various Municipal Functions Including
                                Sanitation, Water Supply, Infrastructure
                                Development, And Public Services.
                            </p>
                            <p>
                                The Nagar Palika Plays A Crucial Role In
                                Maintaining The Cleanliness And Aesthetic Appeal
                                Of Mount Abu, A Popular Tourist Destination
                                Known For Its Serene Beauty And Natural
                                Attractions.
                            </p>
                        </div>
                    </div>

                    {/* --- COLUMN 2: Contact Info (Span 3) --- */}
                    <div className="lg:col-span-3 pt-4 lg:pt-8 flex flex-col gap-6">
                        {/* Phone */}
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="shrink-0 text-black group-hover:text-black/70 transition-colors">
                                <Phone size={18} />
                            </div>
                            <span className="text-[14px] font-medium text-black group-hover:text-black/70 transition-colors">
                                +91 8305591122
                            </span>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="shrink-0 text-black group-hover:text-black/70 transition-colors">
                                <Mail size={18} />
                            </div>
                            <span className="text-[14px] font-medium text-black group-hover:text-black/70 transition-colors">
                                Palikaabu@Gmail.Com
                            </span>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-3 group cursor-pointer">
                            <div className="shrink-0 text-black mt-1 group-hover:text-black/70 transition-colors">
                                <MapPin size={18} />
                            </div>
                            <span className="text-[14px] font-medium max-w-[200px] leading-snug text-black group-hover:text-black/70 transition-colors">
                                Nagar Palika Mount Abu Near Polo Ground
                            </span>
                        </div>
                    </div>

                    {/* --- COLUMN 3: Adventure (Span 2) --- */}
                    <div className="lg:col-span-2 pt-0 lg:pt-0">
                        <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-6">
                            Adventure
                        </h3>
                        <ul className="flex flex-col gap-2.5">
                            {adventureLinks.map((item) => (
                                <li key={item}>
                                    <Link
                                        href="#"
                                        className="text-[14px] text-black hover:text-black/70 transition-colors block"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* --- COLUMN 4: Quick Links & Connect (Span 3) --- */}
                    <div className="lg:col-span-3 pt-0 lg:pt-0 flex flex-col gap-10">
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-6">
                                Quick Links
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {quickLinks.map((item) => (
                                    <li key={item}>
                                        <Link
                                            href="#"
                                            className="text-[14px] text-black hover:text-black/70 transition-colors block"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-6">
                                Connect
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {connectLinks.map((item) => (
                                    <li key={item}>
                                        <Link
                                            href="#"
                                            className="text-[14px] text-black hover:text-black/70 transition-colors block"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="relative z-10 mt-16 pt-8 border-t border-gray-200/50 text-center">
                    <p className="text-[13px] text-black/70">
                        © 2025 Nagar Palika Mount Abu. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
