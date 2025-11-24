import type {Metadata} from "next";
import "../globals.css";
import NavBar from "@/navigation/NavBar"
import Sidebar from "@/navigation/SideBar";
import Box from '@mui/material/Box';

export const metadata: Metadata = {
    title: "Citas Dentaris",
    description: "Pagina de Citas de Dentaris",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: "100%",
            maxHeight: "100vh",
            maxWidth: "100vw",
            overflow: "hidden"
        }}>
            <Sidebar>
                <NavBar/>
                <Box
                    sx={{
                        flex: 1,
                        marginX: -0.5,
                        marginBottom: 2,
                        p: 1,
                        overflow: "auto",
                        height: "calc(100vh - 120px)",
                        maxHeight: "calc(100vh - 120px)",
                        width: "100%",
                        boxSizing: "border-box"
                    }}
                    className="border-2 border-gray-200 rounded-2xl">
                    {children}
                </Box>
            </Sidebar>
        </Box>
    );
}