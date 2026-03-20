import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import AOSInit from '@/components/AOSInit';
import 'aos/dist/aos.css';

const BEFIN_LOGO_URL =
  "https://imgproxy.gamma.app/resize/quality:80/resizing_type:fit/width:2000/height:2000/https://cdn.gamma.app/sw127renn5q43az/2fcac0566ef3447d88d894be587c87cb/original/befin-logo-final.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Befin",
    template: "Befin",
  },
  description: "Make learning about money fun and easy for everyone.",
  keywords: [
    "Befin",
    "financial literacy",
    "youth fintech",
    "learn to invest",
    "goal setting",
    "pocket money",
    "UPI",
    "India",
  ],
  metadataBase: new URL("https://befin.in"),
  icons: {
    icon: BEFIN_LOGO_URL,
    shortcut: BEFIN_LOGO_URL,
    apple: BEFIN_LOGO_URL,
  },
  openGraph: {
    type: "website",
    title: "Befin",
    description: "Make learning about money fun and easy for everyone.",
    url: "https://thebefin.com/",
    images: [
      {
        url: BEFIN_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Befin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Befin",
    description: "Make learning about money fun and easy for everyone.",
    images: [BEFIN_LOGO_URL],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AOSInit />
        <main id="content">{children}</main>
      </body>
    </html>
  );
}
