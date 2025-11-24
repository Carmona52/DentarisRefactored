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
            height: "100vh",
            width: "100vw",
            overflow: "hidden"
        }}>
            <Sidebar>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden"
                }}>
                    <NavBar />
                    <Box sx={{
                        flex: 1,
                        m: 1,
                        p: 2,
                        overflow: "auto",
                        maxWidth: "100%"
                    }}
                         className="border-2 border-gray-200 rounded-2xl">
                        <Box sx={{
                            width: "100%",
                            maxWidth: "100%",
                            overflowX: "auto"
                        }}>
                            {children}
                        </Box>
                    </Box>
                </Box>
            </Sidebar>
        </Box>
    );
}