import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "BeFin - The Smartest Way to Learn and Manage Money",
    description: "BeFin helps you build smart money habits through fun challenges, real rewards, and secure digital payments - all in one app.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
