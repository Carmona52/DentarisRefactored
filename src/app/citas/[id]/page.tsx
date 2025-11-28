'use client'
import {Typography, Box, Paper, Chip, Stack, Divider, Alert, Button} from '@mui/material';
import {useParams} from 'next/navigation';
import {getCitaById} from "@/lib/db/citas/getCitas";
import {useEffect, useState} from "react";
import {cita} from "@/types/citas/cita";
import {setCitaRealizada, setIniciarCita} from "@/lib/db/citas/changeStatesCita";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SimpleLoader from "@/components/loaders/SimpleLoader";
import {useRouter} from "next/navigation";

dayjs.locale('es');


export default function CitaPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>()
    const id = Number(params.id)
    const [citaData, setCitaData] = useState<cita | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCita = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getCitaById(id);

                if (typeof response === 'string') {
                    throw new Error(response);
                }

                setCitaData(response);

            } catch (err) {
                console.error('Error fetching cita:', err);
                setError(err instanceof Error ? err.message : 'Error al cargar la cita');
            } finally {
                setLoading(false);
            }
        };

        fetchCita();
    }, [id]);

    const handleIniciarCita = async () => {
        try {
            await setIniciarCita(id);
            window.location.reload();
        } catch (error) {
            throw new Error(`Error al iniciar la cita${error}`);
        }
    }

    const handleCitaRealizada = async () => {
        try {
            await setCitaRealizada(id);
            window.location.href = '/dashboard';
        } catch (error) {
            throw new Error(`Error al finalizar la cita${error}`);
        }
    }

    const formatDateTime = (dateTimeString: string) => {
        return dayjs(dateTimeString).format('dddd D [de] MMMM [de] YYYY');
    };

    const formatHour = (timeString: string) => {
        return timeString.slice(0, 5);
    };

    const getEstadoColor = (estado: string) => {
        const estadoLower = estado.toLowerCase();
        switch (estadoLower) {
            case 'agendada':
                return 'primary';
            case 'realizada':
                return 'success';
            case 'cancelada':
                return 'error';
            case 'confirmada':
                return 'info';
            case 'pendiente':
                return 'warning';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <SimpleLoader/>
        );
    }

    if (error) {
        return (
            <Box sx={{p: 3}}>
                <Alert severity="error" sx={{mb: 2}}>
                    <Typography variant="h6">Error</Typography>
                    <Typography>{error}</Typography>
                </Alert>
            </Box>
        );
    }

    if (!citaData) {
        return (
            <Box sx={{p: 3}}>
                <Alert severity="warning">
                    <Typography>No se encontraron datos para la cita #{id}</Typography>
                </Alert>
            </Box>
        );
    }


    return (
        <Box sx={{p: 3, maxWidth: 800, margin: '0 auto'}}>

            <Box sx={{mb: 4}}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Detalles de la Cita
                </Typography>
            </Box>

            <Paper elevation={2} sx={{p: 4}}>

                <Box sx={{mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h5" fontWeight="bold">
                        Información General
                    </Typography>
                    <Chip
                        label={citaData.estado}
                        color={getEstadoColor(citaData.estado)}
                        size="medium"
                    />
                </Box>

                <Stack spacing={3}>

                    <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: '1fr 1fr'}, gap: 3}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <CalendarTodayIcon color="primary"/>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Fecha
                                </Typography>
                                <Typography variant="h6">
                                    {formatDateTime(citaData.fecha)}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <AccessTimeIcon color="primary"/>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Hora
                                </Typography>
                                <Typography variant="h6">
                                    {formatHour(citaData.hora)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider/>


                    <Box sx={{display: 'flex', alignItems: 'flex-start', gap: 2}}>
                        <AssignmentIcon color="primary"/>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Motivo de la Consulta
                            </Typography>
                            <Typography variant="h6">
                                {citaData.motivo}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider/>


                    {'paciente' in citaData && citaData.paciente && (
                        <>
                            <Box onClick={() => {
                                window.location.href = `/pacientes/${citaData.paciente.usuario_id}`;
                            }} sx={{cursor: 'pointer'}}>
                                <Typography variant="h6" gutterBottom
                                            sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <PersonIcon color="primary"/>
                                    Información del Paciente
                                </Typography>
                                <Box sx={{pl: 3}}>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Nombre:</strong> {citaData.paciente.nombre} {citaData.paciente.apellidos || ''}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Email:</strong> {citaData.paciente.email}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider/>
                        </>
                    )}


                    {'dentista' in citaData && citaData.dentista && (
                        <Box>
                            <Typography variant="h6" gutterBottom
                                        sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <MedicalServicesIcon color="primary"/>
                                Información del Dentista
                            </Typography>
                            <Box sx={{pl: 3}}>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Nombre:</strong> {citaData.dentista.nombre}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Email:</strong> {citaData.dentista.email}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Stack>
            </Paper>
            <Box sx={{mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2}}>
                <Button variant="outlined" onClick={() => router.back()} color='secondary' size='medium' sx={{my: 2, width: 'full'}}>
                    Volver</Button>
                {citaData.estado === 'Agendada' ?
                    <Button variant='contained' sx={{my: 2, width: 'full'}} color='primary' onClick={handleIniciarCita}>
                        Iniciar Cita</Button>
                    : <Button variant='outlined' sx={{my: 2, width: 'full'}} color='secondary'
                              onClick={handleCitaRealizada}>
                        Terminar Cita</Button>}

            </Box>
        </Box>
    );
}