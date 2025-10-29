import {ThemeProvider} from '@mui/material/styles'
import {theme} from "@/theme/theme";
import type {Metadata} from "next";
import "../globals.css";
import NavBar from "@/components/navigation/NavBar"
import Sidebar from "../../components/navigation/SideBar"
import Box from '@mui/material/Box';


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
        <ThemeProvider theme={theme}>

            <Box sx={{display: "flex", flexDirection: "column", height: "100vh"}}>
                <Sidebar>

                    <NavBar/>
                    <Box
                        sx={{
                            marginX: -.5,
                            marginBottom: 2,
                            p: 1,
                            overflowY: "auto",
                            maxHeight: '100vh',
                        }}
                        className="m-2 border-2 border-gray-200 ml-4">
                        {children}
                    </Box>
                </Sidebar>
            </Box>
        </ThemeProvider>
    );
}
