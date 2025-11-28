'use client'
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3f51b5',
            light: '#757de8',
            dark: '#002984',
        },
        secondary: {
            main: '#f50057',
            light: '#ff5983',
            dark: '#b5003a',
        },
        error: {
            main: '#f44336',
        },
        success: {
            main: '#4caf50',
        },
    },

    typography: {
        fontFamily: '"Sofia Pro", "Arial", "Helvetica", sans-serif',
        h1: {
            fontFamily: '"Sofia Pro Bold", "Arial", "Helvetica", sans-serif',
            fontWeight: 700,
        },
        h2: {
            fontFamily: '"Sofia Pro SemiBold", "Arial", "Helvetica", sans-serif',
            fontWeight: 600,
        },
        h3: {
            fontFamily: '"Sofia Pro SemiBold", "Arial", "Helvetica", sans-serif',
            fontWeight: 600,
        },
        h4: {
            fontFamily: '"Sofia Pro SemiBold", "Arial", "Helvetica", sans-serif',
            fontWeight: 600,
        },
        h5: {
            fontFamily: '"Sofia Pro", "Arial", "Helvetica", sans-serif',
            fontWeight: 500,
        },
        h6: {
            fontFamily: '"Sofia Pro", "Arial", "Helvetica", sans-serif',
            fontWeight: 500,
        },
        body1: {
            fontFamily: '"Sofia Pro", "Arial", "Helvetica", sans-serif',
        },
        body2: {
            fontFamily: '"Sofia Pro", "Arial", "Helvetica", sans-serif',
        },
        button: {
            fontFamily: '"Sofia Pro", "Arial", "Helvetica", sans-serif',
            fontWeight: 500,
        },
        caption: {
            fontFamily: '"Sofia Pro", "Arial", "Helvetica", sans-serif',
        },
        overline: {
            fontFamily: '"Sofia Pro", "Arial", "Helvetica", sans-serif',
        },
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '@font-face': {
                    fontFamily: 'Sofia Pro',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    src: 'local("Sofia Pro"), url("/fonts/sofia-pro-regular.woff2") format("woff2")',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    padding: '10px 24px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    },
                },
            },
            variants: [
                {
                    props: { variant: 'contained', color: 'primary' },
                    style: {
                        backgroundColor: '#3f51b5',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#303f9f',
                            transform: 'translateY(-1px)',
                        },
                    },
                },
                {
                    props: { variant: 'contained', color: 'secondary' },
                    style: {
                        backgroundColor: '#f50057',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#b5003a',
                            transform: 'translateY(-1px)',
                        },
                    },
                },
                {
                    props: { variant: 'contained', color: 'error' },
                    style: {
                        backgroundColor: '#f44336',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#d32f2f',
                        },
                    },
                },
                {
                    props: { variant: 'contained', color: 'success' },
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#388e3c',
                        },
                    },
                },
            ],
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: '"Sofia Pro", "Arial", "Helvetica", sans-serif',
                },
            },
        },
    },
})