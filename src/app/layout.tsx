import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import OverlappingFrames from "@/components/overLappingFrames";
import { headers } from "next/headers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
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
  description:
    "Discover the beauty of Mount Abu, Rajasthan's only hill station",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;
  return (
    <html lang="en" nonce={nonce}>
      <body
        className={`${montserrat.variable} ${baronNeue.variable} antialiased`}
      >
        <OverlappingFrames />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.next) {
                window.next.version = 'hidden';
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
