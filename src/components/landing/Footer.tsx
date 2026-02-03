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
    { label: "Top Destinations", href: "/#destinations" },
    { label: "Temples", href: "/#destinations" },
    { label: "Heritage", href: "/#destinations" },
    { label: "Parks And Wildlife", href: "/#destinations" },
    { label: "Viewpoints", href: "/#destinations" },
    { label: "Markets", href: "/#destinations" },
    { label: "Hidden Gems", href: "/#hidden-places" },
    { label: "Eco Tourism & Adventures", href: "/#adventures" },
    { label: "Fairs And Festivals", href: "/#notices" },
    { label: "Information & Guidelines", href: "/#info-guidelines" },
];

const quickLinks = [
    "Administrative Office",
    "Rajasthan Sampark",
    "Pehchan",
    "Eproc",
    "Notices",
    "Tenders",
    "Complaints",
    "Digital Construction Token",
    "Emergency Contacts",
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
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                <Image
                    src="/images/footer/bg-pattern.png"
                    alt=""
                    fill
                    className="object-cover object-bottom"
                />
            </div>

            <div className="relative z-10 w-full px-6 pt-10 pb-6 lg:px-12 xl:px-20 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-8 xl:gap-x-12">
                    {/* --- COLUMN 1: Logo, Contact, Socials, Description (Span 5) --- */}
                    <div className="lg:col-span-5 flex flex-col gap-5">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {/* Logo */}
                            <div className="relative w-[140px] h-[100px] shrink-0">
                                <Image
                                    src="/images/footer/logo.png"
                                    alt="Nagar Palika Mount Abu"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>

                            {/* Contact Info (Moved here to match image layout) */}
                            <div className="flex flex-col gap-3 pt-2">
                                <div className="flex items-center gap-2 group cursor-pointer">
                                    <div className="shrink-0 text-black">
                                        <Phone size={16} />
                                    </div>
                                    <span className="text-[13px] font-medium text-black">
                                        +91 8305591122
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 group cursor-pointer">
                                    <div className="shrink-0 text-black">
                                        <Mail size={16} />
                                    </div>
                                    <span className="text-[13px] font-medium text-black">
                                        Palikaabu@Gmail.Com
                                    </span>
                                </div>

                                <div className="flex items-start gap-2 group cursor-pointer">
                                    <div className="shrink-0 text-black mt-0.5">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="text-[13px] font-medium max-w-[200px] leading-snug text-black">
                                        Nagar Palika Mount Abu Near Polo Ground
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4 text-black pl-1">
                            <Link href="https://www.instagram.com/np.mountabu?igsh=MTE3bW9sd3B2eW1vMw%3D%3D&utm_source=qr" className="hover:text-black/70 transition-colors">
                                <Instagram size={18} />
                            </Link>
                            <Link href="https://www.facebook.com/share/1CwEH7SrJq/?mibextid=wwXIfr" className="hover:text-black/70 transition-colors">
                                <Facebook size={18} />
                            </Link>
                            <Link href="https://x.com/npmountabu?s=21&t=xT07g2afJhAy8mov76WXzg" className="hover:text-black/70 transition-colors">
                                <Twitter size={18} />
                            </Link>
                            <Link href="https://youtube.com/@np.mountabu?si=vtjs6kTlEcNC1OM4" className="hover:text-black/70 transition-colors">
                                <Youtube size={18} />
                            </Link>
                        </div>

                        {/* Description */}
                        <div className="text-[12px] leading-relaxed text-black text-justify pr-0 lg:pr-4">
                            The Nagar Palika Mount Abu Is The Local Governing Body Responsible For The Administration And Development Of The Hill Station. Located Near The Polo Ground, It Oversees Various Municipal Functions Including Sanitation, Water Supply, Infrastructure Development, And Public Services. The Nagar Palika Plays A Crucial Role In Maintaining The Cleanliness And Aesthetic Appeal Of Mount Abu, A Popular Tourist Destination Known For Its Serene Beauty And Natural Attractions.
                        </div>
                    </div>

                    {/* --- COLUMN 2: Adventure, FAQ, Help (Span 3) --- */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        {/* Adventure */}
                        <div>
                            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-3">Adventure</h3>
                            <ul className="flex flex-col gap-1.5">
                                {adventureLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link href={item.href} className="text-[13px] text-black hover:text-black/70 transition-colors block">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* FAQ & Help */}
                        <div className="flex flex-col gap-2">
                            <Link href="/FAQs" className="text-[15px] font-bold text-[#1a1a1a] hover:text-[#1a1a1a]/70 transition-colors">
                                Frequently Asked Questions
                            </Link>
                            <Link href="/help" className="text-[15px] font-bold text-[#1a1a1a] hover:text-[#1a1a1a]/70 transition-colors">
                                Help
                            </Link>
                        </div>
                    </div>

                    {/* --- COLUMN 3: Quick Links, Other Govt, Connect (Span 4) --- */}
                    <div className="lg:col-span-4 flex flex-col gap-6 pl-0 lg:pl-8">
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-3">Quick Links</h3>
                            <ul className="flex flex-col gap-1.5">
                                {quickLinks.map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-[13px] text-black hover:text-black/70 transition-colors block">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Other Govt Links */}
                        <div>
                          <Link href="/important-links" className="text-[15px] font-bold text-[#1a1a1a] hover:text-[#1a1a1a]/70 transition-colors">
                              Other Govt. Links
                          </Link>
                        </div>

                        {/* Connect */}
                        <div>
                            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-3">Connect</h3>
                            <ul className="flex flex-col gap-1.5">
                                {connectLinks.map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-[13px] text-black hover:text-black/70 transition-colors block">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="relative z-10 mt-8 pt-6 border-t border-gray-300 text-center">
                    <p className="text-[12px] text-black/80">
                        © 2025 Nagar Palika Mount Abu. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
