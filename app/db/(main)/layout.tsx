import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/app/db/components/Navbar";


export const metadata: Metadata = {
    title: "Olympiad Profile Database",
    description: "Lookup Any Olympiad Profile",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {


    return (

    <html lang="en">
        <body className={`antialiased`}>

            {children}
            <Navbar/>
        </body>

    </html>
    );
}
