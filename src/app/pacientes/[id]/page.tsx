'use client'
import {useState, useEffect} from 'react';
import {useRouter, useParams} from 'next/navigation';
import {getPacienteById} from '@/lib/db/pacientes/pacientes';
import {usuario} from '@/types/auth/auth';
import SimpleLoader from "@/components/loaders/SimpleLoader";
import {Box, Card, CardContent, Typography, Grid, Chip, Divider, Paper, Alert, Button, Container} from '@mui/material';
import {Person, Email, Phone, Cake, LocationOn, Work, Assignment, Emergency, CalendarToday, Female, Male }from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export default function TuComponente() {
    const router = useRouter();
    const params = useParams<{ id: string }>()
    const id = Number(params.id)
    const [paciente, setPaciente] = useState<usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dataPaciente = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getPacienteById(id);

            if (data.success) {
                const infoPaciente: usuario = data.paciente as usuario;
                setPaciente(infoPaciente);
            } else {
                setError('No se pudo obtener la información del paciente');
            }
        } catch (err) {
            setError('Error al cargar los datos del paciente');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        dataPaciente();
    }, [id]);

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('DD [de] MMMM [de] YYYY');
    };

    const calcularEdad = (fechaNacimiento: string) => {
        return dayjs().diff(dayjs(fechaNacimiento), 'year');
    };

    const procesarAlergias = (alergiasString: string): string[] => {
        if (!alergiasString || alergiasString.trim() === '') return [];

        return alergiasString
            .split(',')
            .map(alergia => alergia.trim())
            .filter(alergia => alergia !== '');
    };

    if (loading) return <SimpleLoader/>;

    if (error) {
        return (
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" onClick={()=>router.back()}>
                            Regresar
                        </Button>
                    }>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!paciente) {
        return (
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Alert severity="warning">
                    No se encontró información del paciente.
                </Alert>
            </Container>
        );
    }

    const alergiasArray = procesarAlergias(paciente.alergias as unknown as string);

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
                            <img src='/images/profile.png' alt="Foto del Paciente" style={{ width: '100%', borderRadius: '12px', maxWidth: '250px' }} loading='lazy'/>
                        </Box>
                        <Box flex={1}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                {paciente.nombre} {paciente.apellidos}
                            </Typography>
                            <Box display="flex" gap={2} flexWrap="wrap">
                                <Chip label={paciente.genero === 'M' ? 'Masculino' : paciente.genero === 'F' ? 'Femenino' : 'Otro'} variant="outlined" icon={paciente.genero === 'M' ? <Male/> : <Female/>}/>
                                <Chip label={`${calcularEdad(paciente.fecha_nacimiento)} años`} variant="outlined" icon={<Cake/>}/>
                                <Chip label={`ID: ${paciente.usuario_id}`} variant="outlined"/>
                            </Box>

                            <Button sx={{my:2}} onClick={()=> router.push(`historial/${id}`)}>Ver Historial Médico</Button>
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
                                    value={paciente.email}
                                />
                                <InfoItem
                                    icon={<Phone/>}
                                    label="Teléfono"
                                    value={paciente.telefono || 'No proporcionado'}
                                />
                                <InfoItem
                                    icon={<Cake/>}
                                    label="Fecha de Nacimiento"
                                    value={`${formatDate(paciente.fecha_nacimiento)}`}
                                />
                                <InfoItem
                                    icon={<LocationOn/>}
                                    label="Dirección"
                                    value={paciente.direccion || 'No proporcionada'}
                                />
                                <InfoItem
                                    icon={<Assignment/>}
                                    label="Identificación"
                                    value={paciente.numero_identificacion}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary" display="flex" alignItems="center" gap={1}>
                                <Work /> Información Médica
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box display="flex" flexDirection="column" gap={2}>
                                <InfoItem
                                    icon={<Work />}
                                    label="Profesión"
                                    value={paciente.profesion || 'No especificada'}
                                />
                                <InfoItem
                                    icon={<LocationOn />}
                                    label="País de Origen"
                                    value={paciente.pais_origen || 'No especificado'}
                                />

                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" display="flex" alignItems="center" gap={1} mb={1}>
                                        <Emergency /> Alergias
                                    </Typography>
                                    {alergiasArray.length > 0 ? (
                                        <Box display="flex" gap={1} flexWrap="wrap">
                                            {alergiasArray.map((alergia, index) => (
                                                <Chip
                                                    key={index}
                                                    label={alergia}
                                                    size="small"
                                                    color="warning"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No registra alergias
                                        </Typography>
                                    )}
                                </Box>

                                {/* Notas */}
                                {paciente.notas && (
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" display="flex" alignItems="center" gap={1} mb={1}>
                                            <Assignment /> Notas Adicionales
                                        </Typography>
                                        <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                                            <Typography variant="body2">
                                                {paciente.notas}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Contacto de Emergencia y Información del Sistema*/}
                <Grid>
                    <Card>
                        <CardContent sx={{p: 3}}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary" display="flex"
                                        alignItems="center" gap={1}>
                                <Emergency/> Contacto de Emergencia
                            </Typography>
                            <Divider sx={{mb: 2}}/>

                            <Grid container spacing={3}>
                                <Grid>
                                    <InfoItem
                                        label="Nombre del Contacto"
                                        value={paciente.nombre_contacto_emergencia || 'No especificado'}
                                    />
                                </Grid>
                                <Grid>
                                    <InfoItem
                                        label="Teléfono de Emergencia"
                                        value={paciente.telefono_contacto_emergencia || 'No especificado'}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{mt: 3}}>
                        <CardContent sx={{p: 3}}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary" display="flex"
                                        alignItems="center" gap={1}>
                                <CalendarToday/> Información del Sistema
                            </Typography>
                            <Divider sx={{mb: 2}}/>

                            <Grid container spacing={3}>
                                <Grid>
                                    <InfoItem
                                        label="Fecha de Creación"
                                        value={formatDate(paciente.created_at?? '')}
                                    />
                                </Grid>
                                <Grid>
                                    <InfoItem
                                        label="Última Actualización"
                                        value={formatDate(paciente.updated_at?? '')}
                                    />
                                </Grid>
                                {paciente.last_login && (
                                    <Grid>
                                        <InfoItem
                                            label="Último Inicio de Sesión"
                                            value={formatDate(paciente.last_login)}
                                        />
                                    </Grid>
                                )}
                            </Grid>
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
