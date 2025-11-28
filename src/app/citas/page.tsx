'use client'
import {getCitasDetalle} from "@/lib/db/citas/getCitas";
import {TableWithButton} from "@/Tables/tablasCitas/TableWithButton";
import {useEffect, useState} from "react";
import {cita} from "@/types/citas/cita";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddCita from "@/PopUpsCitas/AddCita";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function CitasPage() {
    const apiUrl = process.env.NEXT_PUBLIC_CITAS_URL;
    if (!apiUrl) throw new Error("Missing API URL");

    const [citaDetalle, setCitaDetalle] = useState<cita[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    const handleAgendarCita = async (citaData:any) => {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(citaData),
            });

            if (!response.ok) {
                throw new Error('Error al agendar cita');
            }

            const result = await response.json();
            console.log('Cita agendada:', result);


            const citasActualizadas = await getCitasDetalle();
            if (Array.isArray(citasActualizadas)) {
                setCitaDetalle(ordenarCitasPorEstado(citasActualizadas));
            }

            alert('Cita agendada exitosamente!');
            setModalOpen(false);

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const ordenarCitasPorEstado = (citas: cita[]): cita[] => {
        return [...citas].sort((a, b) => {

            const ordenEstados = {
                'en proceso': 1,
                'agendada': 2,
                'realizada': 3,
                'cancelada': 4
            };


            const estadoA = (a.estado || '').toLowerCase() as keyof typeof ordenEstados;
            const estadoB = (b.estado || '').toLowerCase() as keyof typeof ordenEstados;

            const prioridadA = ordenEstados[estadoA] || 5;
            const prioridadB = ordenEstados[estadoB] || 5;


            return prioridadA - prioridadB;
        });
    };

    useEffect(() => {
        const getCitasDetalleData = async () => {
            const citas: cita[] | string = await getCitasDetalle();

            if (Array.isArray(citas)) {
                setCitaDetalle(ordenarCitasPorEstado(citas));
            } else {
                console.error('Error al obtener citas:', citas);
            }
        };

        getCitasDetalleData();
    }, []);

    return (
        <>
            <AddCita
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onAgendarCita={handleAgendarCita}
            />

            <Box sx={{ p: 3 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 4 }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                    >
                        Histórico de Citas Médicas
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => setModalOpen(true)}
                        sx={{
                            minWidth: 200,
                            py: 1.5
                        }}>
                        Agendar Nueva Cita
                    </Button>
                </Stack>

                <TableWithButton data={citaDetalle}/>
            </Box>
        </>
    );
}