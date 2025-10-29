'use client'
import {createTheme} from '@mui/material/styles'

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },

    typography: {
        fontFamily: "Sofia Pro, sans-serif",
        h1: {fontFamily: "Sofia Pro Bold, sans-serif"},
        h2: {fontFamily: "Sofia Pro SemiBold, sans-serif"},
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    padding: '8px 16px',
                    backgroundColor: '#3f51b5',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#303f9f',
                    },
                },
            },
        },
    },

})