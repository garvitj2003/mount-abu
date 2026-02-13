import type { Metadata } from "next";
import { Montserrat, Onest } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import OverlappingFrames from "@/components/landing/overLappingFrames";
import QueryProvider from "@/components/providers/QueryProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baronNeue = localFont({
  src: [
    {
      path: "../../public/fonts/baron-neue/baron-neue.regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/baron-neue/Baron Neue Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/baron-neue/Baron Neue Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/baron-neue/Baron Neue Bold Italic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/baron-neue/Baron Neue Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/baron-neue/Baron Neue Black Italic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-baron",
});

export const metadata: Metadata = {
  title: "Mount Abu - Majestic Hill Station",
  description: "Discover the beauty of Mount Abu, Rajasthan's only hill station",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${onest.variable} ${baronNeue.variable} antialiased`}>
        <QueryProvider>
          <OverlappingFrames />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
