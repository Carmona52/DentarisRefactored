import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Box from '@mui/material/Box';

import {ThemeProvider} from '@mui/material/styles'
import {theme} from "@/theme/theme";

export const metadata: Metadata = {
    title: "Dentaris Web Page",
    description: "Dentaris, es un sistema SaaS para la gestión integral de consultorios dentales.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='es'>
        <ThemeProvider theme={theme}>
            <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
            <div
                style={{
                    height: '100vh',
                    width: '100vw',
                    margin: 0,
                    padding: 0,
                    overflow: 'auto'
                }}
            >
                <Box
                    className="border-2 border-gray-200 rounded-2xl"
                    sx={{
                        height: '100vh',
                        width: '100vw',
                        maxHeight: '100vh',
                        maxWidth: '100vw',
                        overflow: 'auto',
                        boxSizing: 'border-box',
                        p: 2
                    }}
                >
                    <Box
                        sx={{
                            height: '100%',
                            width: '100%',
                            overflow: 'hidden',
                            boxSizing: 'border-box'
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </div>
            </body>
        </ThemeProvider>
        </html>
    );
}