'use client'
import {useState, useEffect} from 'react';
import {useRouter, useParams} from 'next/navigation';
import {getDentistaById} from "@/lib/db/dentistas/dentistas";
import {usuario} from '@/types/auth/auth';
import SimpleLoader from "@/components/loaders/SimpleLoader";
import {Box, Card, CardContent, Typography, Grid, Chip, Divider, Alert, Button, Container} from '@mui/material';
import {Person, Email, Phone, Cake} from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export default function DentistaPageID() {
    const router = useRouter();
    const params = useParams<{ id: string }>()
    const id = Number(params.id)
    const [dentista, setDentista] = useState<usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dataDentista = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getDentistaById(id);
            console.log(data);

            setDentista(data);
        } catch (err) {
            setError('' + err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        dataDentista();
    }, [id]);

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('DD [de] MMMM [de] YYYY');
    };

    const calcularEdad = (fechaNacimiento: string) => {
        return dayjs().diff(dayjs(fechaNacimiento), 'year');
    };


    if (loading) return <SimpleLoader/>;

    if (error) {
        return (
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" onClick={() => router.back()}>
                            Regresar
                        </Button>
                    }>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!dentista) {
        return (
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Alert severity="warning">
                    No se encontró información del paciente.
                </Alert>
            </Container>
        );
    }


    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Card sx={{mb: 4}}>
                <CardContent sx={{p: 4}}>
                    <Box display="flex" alignItems="center" gap={3}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem'
                            }}>
                            <img src='/images/profile.png' alt="Foto del Paciente"
                                 style={{width: '100%', borderRadius: '12px', maxWidth: '250px'}} loading='lazy'/>
                        </Box>
                        <Box flex={1}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                {dentista.nombre} {dentista.apellidos}
                            </Typography>
                            <Box display="flex" gap={2} flexWrap="wrap">
                                <Chip label={`${calcularEdad(dentista.fecha_nacimiento)} años`} variant="outlined"
                                      icon={<Cake/>}/>
                                <Chip label={`ID: ${dentista.usuario_id}`} variant="outlined"/>
                            </Box>

                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Grid container spacing={3}>

                <Grid>
                    <Card sx={{height: '100%'}}>
                        <CardContent sx={{p: 3}}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary" display="flex"
                                        alignItems="center" gap={1}>
                                <Person/> Información Personal
                            </Typography>
                            <Divider sx={{mb: 2}}/>

                            <Box display="flex" flexDirection="column" gap={2}>
                                <InfoItem
                                    icon={<Email/>}
                                    label="Email"
                                    value={dentista.email}
                                />
                                <InfoItem
                                    icon={<Phone/>}
                                    label="Teléfono"
                                    value={dentista.telefono || 'No proporcionado'}
                                />
                                <InfoItem
                                    icon={<Cake/>}
                                    label="Fecha de Nacimiento"
                                    value={`${formatDate(dentista.fecha_nacimiento)}`}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid>
                    <Card sx={{height: '100%'}}>
                        <CardContent sx={{p: 3}}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary" display="flex"
                                        alignItems="center" gap={1}>
                                <Person/> Información Profesional
                            </Typography>
                            <Divider sx={{mb: 2}}/>

                            <Box display="flex" flexDirection="column" gap={2}>
                                <InfoItem
                                    icon={<Email/>}
                                    label="Carrera Profesional"
                                    value={dentista.carrera || 'No proporcionada'}
                                />
                                <InfoItem
                                    icon={<Phone/>}
                                    label="Cédula Profesional"
                                    value={dentista.cedula_profesional || 'No proporcionado'}
                                />

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

interface InfoItemProps {
    icon?: React.ReactNode;
    label: string;
    value: string;
}

const InfoItem = ({icon, label, value}: InfoItemProps) => (
    <Box display="flex" flexDirection="column" gap={0.5}>
        <Typography variant="subtitle2" color="text.secondary" display="flex" alignItems="center" gap={1}>
            {icon} {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
            {value}
        </Typography>
    </Box>
);
