'use client'
import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import {
    Box,
    CssBaseline,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    Dashboard as DashboardIcon,
    EventNote as EventNoteIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    ExitToApp as ExitToAppIcon,
    SupervisedUserCircle as SupervisedUserCircleIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

type DrawerLayoutProps = {
    children: React.ReactNode;
};

interface NavItem {
    text: string;
    icon: React.ReactElement;
    path: string;
}

interface NavSection {
    items: NavItem[];
}

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

//  Configuración de secciones
const sections: NavSection[] = [
    {
        items: [
            { text: 'Dashboard', icon: <DashboardIcon fontSize="large"/>, path: '/dashboard' },
            { text: 'Registro de Citas', icon: <EventNoteIcon fontSize="large"/>, path: '/citas' },
            { text: 'Lista de Pacientes', icon: <PeopleIcon fontSize="large"/>, path: '/pacientes' },
        ],
    },
    {
        items: [
            { text: 'Personal Médico', icon: <SupervisedUserCircleIcon fontSize="large"/>, path: '/dentistas' },
            { text: 'Ajustes', icon: <SettingsIcon fontSize="large"/>, path: '/ajustes' },
            { text: 'Cerrar Sesión', icon: <ExitToAppIcon fontSize="large"/>, path: 'logout' },
        ],
    },
];

//  Estilos para items
const navItemSx = {
    px: 2,
    py: 1.5,
    borderRadius: 2,
    mb: 0.5,
    cursor: 'pointer',
    '&:hover': { bgcolor: '#F0F4F8' },
};

function NavList({ items, pathname, onNavigate,open }: { items: NavItem[]; pathname: string; onNavigate: (path: string) => void, open:boolean}) {
    return (
        <List>
            {items.map(({ text, icon, path }) => {
                const isActive = pathname === path;
                return (
                    <ListItemButton
                        key={text}
                        onClick={() => onNavigate(path)}
                        sx={{
                            ...navItemSx,
                            bgcolor: isActive ? '#E6F6FD' : 'transparent',
                        }}>
                        <ListItemIcon sx={{ color: '#567287', minWidth: 36 }}>{icon}</ListItemIcon>
                        {open && (<ListItemText
                            primary={<Typography sx={{ color: '#2F4858', fontSize: '0.9rem', marginLeft:2 }}>{text}</Typography>}
                        />)}

                    </ListItemButton>
                );
            })}
        </List>
    );
}

export default function MiniDrawer({ children }: DrawerLayoutProps) {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleDrawerToggle = () => setOpen((prev) => !prev);

    const handleNavigate = (path: string) => {
        if (path === 'logout') {
            console.log('Cerrar sesión');
        } else {
            router.push(path);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerToggle}>
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                {sections.map((section, idx) => (
                    <React.Fragment key={idx}>
                        <NavList items={section.items} pathname={pathname} onNavigate={handleNavigate} open={open} />
                        {idx < sections.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 1, mt: -8 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}