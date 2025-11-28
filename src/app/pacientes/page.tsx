'use client'
import {getPacientes} from "@/lib/db/pacientes/pacientes";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {usuario} from "@/types/auth/auth";
import {TableWithButtonPatient} from "@/TablesPacientes/TableWithButton";
import {Typography, Button, Box} from "@mui/material";
import GuardarPacienteModal from "@/components/popups/pacientes/addPaciente";
import AddIcon from '@mui/icons-material/Add';
import SimpleLoader from "@/components/loaders/SimpleLoader";

export default function PacientesPage() {
    const router = useRouter();
    const [pacientes, setPacientes] = useState<usuario[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPacientes();
    }, []);

    const fetchPacientes = async () => {
        setLoading(true);
        try {
            const data = await getPacientes();
            console.log(data);
            if (Array.isArray(data)) {

                const sortedData = data.sort((a, b) => {

                    const ordenEstados = {
                        'Activo': 1,
                        'Baja': 2,
                    };
                    const estadoA = (a.estado || '') as keyof typeof ordenEstados;
                    const estadoB = (b.estado || '') as keyof typeof ordenEstados;


                    if (estadoA !== estadoB) return (ordenEstados[estadoA] || 0) - (ordenEstados[estadoB] || 0);


                    const fechaA = new Date(a.created_at || '').getTime();
                    const fechaB = new Date(b.created_at || '').getTime();

                    return fechaB - fechaA;
                });

                setPacientes(sortedData);
            } else {
                console.error("Error al obtener pacientes:", data);
            }
        } catch (error) {
            console.error("Error fetching pacientes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setModalOpen(!modalOpen);
    };

    const handlePacienteCreado = () => {
        fetchPacientes();
        setModalOpen(false);
    };

    return (
        <>
            {loading ? (
                <SimpleLoader/>
            ) : (
                <>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                        <Typography variant='h2' sx={{fontWeight: 'bold'}}>
                            Lista de Pacientes
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon/>}
                            onClick={handleOpenModal}
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0'
                                }
                            }}
                        >
                            Nuevo Paciente
                        </Button>
                    </Box>

                    <TableWithButtonPatient data={pacientes}/>
                </>
            )}

                <GuardarPacienteModal
                    open={modalOpen}
                    onClose={handleOpenModal}
                    onPacienteCreado={handlePacienteCreado}
                />
        </>
    );
}
