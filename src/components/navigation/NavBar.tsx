'use client'
import React, {useCallback} from "react";
import {AppBar, Box, Toolbar, IconButton} from '@mui/material';
import Image from "next/image";
import {useRouter} from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const NavBar: React.FC = React.memo(() => {
    const router = useRouter();

    const returnDashboard = useCallback(() => {
        router.push("/dashboard");
    }, [router]);

    return (
        <AppBar position="static"
                sx={{background: "transparent", border: "2px solid", borderColor: "grey.200", borderRadius: 2, mb: 3,}}>
            <Toolbar sx={{borderRadius: 2, bgcolor: "white", justifyContent: "space-between"}}>
                <Box sx={{cursor: "pointer", display: "flex", alignItems: "center"}} onClick={returnDashboard}
                     role="button" aria-label="Ir al dashboard">
                    <Image src="/branding/LogoBackRec.png" alt="Logo Dentaris" width={120} height={80} priority/>
                </Box>
                <Box>

                    <IconButton aria-label="Perfil de usuario">
                        <PersonIcon/>
                    </IconButton>
                    <IconButton aria-label='Notificaciones del Usuario'>
                        <NotificationsNoneIcon/>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
});

NavBar.displayName = "NavBar";

export default NavBar;