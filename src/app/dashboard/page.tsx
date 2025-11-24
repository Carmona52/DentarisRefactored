'use client'
import * as React from 'react';
import {Box, Typography} from '@mui/material';
import {getCitasDetalle} from "@/lib/db/citas/getCitas";
import {cita} from "@/types/citas/cita";
import {useEffect, useState} from "react";
import {DateCalendar, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import CardCita from "@/cards/CardCita";
dayjs.locale('es')

export default function Home() {

    const [citaDetalle, setCitaDetalle] = useState<cita[]>([]);
    const fechaDeHoy = dayjs().format('YYYY-MM-DD');
    const [fechaSeleccionada, setFechaSeleccionada] = React.useState(dayjs());


    const fechaSeleccionadaFormato = fechaSeleccionada.format('YYYY-MM-DD');

    useEffect(() => {
        const getCitasDetalleData = async () => {
            const citas: cita[] | string = await getCitasDetalle();

            if (Array.isArray(citas)) {
                setCitaDetalle(citas);
                citaDetalle.forEach(cita => console.log(cita.paciente));
            } else {
                console.error('Error al obtener citas:', citas);
            }
        };

        getCitasDetalleData()
    }, []);

    return (
        <>
            <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: '2fr 1fr'}, gap: 3, p: 3,}}>

                <Box className="border-r pr-5 border-gray-400 my-6">

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es'}>
                        <DateCalendar value={fechaSeleccionada} onChange={(newValue) => {if (newValue) setFechaSeleccionada(newValue);}}
                                      showDaysOutsideCurrentMonth fixedWeekNumber={5}/>
                    </LocalizationProvider>

                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 600, textAlign: 'center', marginBottom: '2rem' }}>
                        {fechaSeleccionadaFormato === fechaDeHoy
                            ? 'Citas agendadas para hoy'
                            : `Citas agendadas para el ${fechaSeleccionada.format('D [de] MMMM [de] YYYY')}`}
                    </Typography>

                    <Box display="grid" gridTemplateColumns={{xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr'}} gap={2}>
                        {citaDetalle.map((cita, key) => (
                            <CardCita cita={cita} key={key}></CardCita>))}
                    </Box>
                </Box>


                <Box display="flex" flexDirection="column" gap={3}>
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1} p={2} bgcolor="#fff" boxShadow={2}
                         borderRadius={2} className="h-72 w-72 text-center mx-auto">
                        <Box textAlign="center" className="border-r border-gray-200" sx={{cursor: 'pointer'}}>
                            <Typography variant="h2" fontWeight="bold">
                                5
                            </Typography>
                            <Typography variant="h5">Citas Hoy</Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography variant="h2" fontWeight="bold">
                                5
                            </Typography>
                            <Typography variant="h5">Canceladas</Typography>
                        </Box>
                        <Box
                            textAlign="center"
                            gridColumn="span 2"
                            pt={1}
                            borderTop="1px solid #eee">
                            <Typography variant="h2" fontWeight="bold">2</Typography>
                            <Typography variant="h5">Nuevos Pacientes</Typography>
                        </Box>
                    </Box>

                    <Typography variant="h6" fontWeight="bold">
                        Citas Próximas
                    </Typography>

                    <Box gap={2} sx={{my: 2, display: 'flex', flexDirection: 'column'}}>

                    </Box>
                </Box>
            </Box>
        </>
    );
}
