import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../globals.css";
import NavBar from "@/components/navigation/NavBar"
import Sidebar from "../../components/navigation/SideBar"
import Box from '@mui/material/Box';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Dentaris DashBoard",
    description: "Dashboard Dentaris, ",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Sidebar>
                <NavBar/>
                <Box className="border-2 border-gray-200 rounded-2xl h-screen overflow-y-auto p-2">
                    {children}
                </Box>
            </Sidebar>
        </div>

    );
}
