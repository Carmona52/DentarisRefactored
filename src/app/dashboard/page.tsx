'use client'
import * as React from 'react';
import {Box, Typography, Chip} from '@mui/material';
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
    const [fechaSeleccionada, setFechaSeleccionada] = React.useState(dayjs());

    const fechaDeHoy = dayjs().format('YYYY-MM-DD');
    const fechaSeleccionadaFormato = fechaSeleccionada.format('YYYY-MM-DD');

    useEffect(() => {
        const getCitasDetalleData = async () => {
            const citas: cita[] | string = await getCitasDetalle();

            if (Array.isArray(citas)) {
                const citasOrdenadas = citas.sort((a, b) => {
                    const fechaA = dayjs(a.fecha);
                    const fechaB = dayjs(b.fecha);
                    return fechaA.diff(fechaB);
                });
                setCitaDetalle(citasOrdenadas);
            } else {
                console.error('Error al obtener citas:', citas);
            }
        };

        getCitasDetalleData()
    }, []);


    const extraerFecha = (fechaISO: string) => {
        return dayjs(fechaISO).format('YYYY-MM-DD');
    };


    const citasDelDiaSeleccionado = citaDetalle.filter(cita =>
        extraerFecha(cita.fecha) === fechaSeleccionadaFormato
    );


    const citasDeHoy = citaDetalle.filter(cita =>
        extraerFecha(cita.fecha) === fechaDeHoy
    );


    const citasCanceladasHoy = citasDeHoy.filter(cita =>
        cita.estado === 'cancelada' || cita.estado === 'cancelado'
    );


    const totalCitasHoy = citasDeHoy.length;

    const citasProximas = citaDetalle
        .filter(cita => {
            const fechaCita = dayjs(cita.fecha);
            const esPosterior = fechaCita.isAfter(fechaSeleccionada, 'day');
            const noEsDelDiaSeleccionado = extraerFecha(cita.fecha) !== fechaSeleccionadaFormato;
            return esPosterior && noEsDelDiaSeleccionado;
        })
        .slice(0, 5);

    return (
        <>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {xs: '1fr', md: '2fr 1fr'},
                gap: 3,
                p: 3,
            }}>

                <Box className="border-r pr-5 border-gray-400 my-6">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es'}>
                        <DateCalendar
                            value={fechaSeleccionada}
                            onChange={(newValue) => {
                                if (newValue) setFechaSeleccionada(newValue);
                            }}
                            showDaysOutsideCurrentMonth
                            fixedWeekNumber={5}
                        />
                    </LocalizationProvider>

                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 600, textAlign: 'center', marginBottom: '2rem' }}>
                        {fechaSeleccionadaFormato === fechaDeHoy
                            ? 'Citas agendadas para hoy'
                            : `Citas agendadas para el ${fechaSeleccionada.format('D [de] MMMM [de] YYYY')}`}

                        <Chip
                            label={`${citasDelDiaSeleccionado.length} citas`}
                            color="primary"
                            variant="filled"
                            size="small"
                            sx={{ ml: 2 }}
                        />
                    </Typography>

                    <Box display="grid" gridTemplateColumns={{
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '1fr 1fr 1fr'
                    }} gap={2}>
                        {citasDelDiaSeleccionado.map((cita, key) => (
                            <CardCita cita={cita} key={key} />
                        ))}

                        {citasDelDiaSeleccionado.length === 0 && (
                            <Box gridColumn="1 / -1" textAlign="center" py={4}>
                                <Typography variant="h6" color="text.secondary">
                                    No hay citas para esta fecha
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Columna derecha - Estadísticas y citas próximas */}
                <Box display="flex" flexDirection="column" gap={3}>
                    {/* Panel de estadísticas */}
                    <Box
                        display="grid"
                        gridTemplateColumns="1fr 1fr"
                        gap={1}
                        p={2}
                        bgcolor="#fff"
                        boxShadow={2}
                        borderRadius={2}
                        className="h-72 w-72 text-center mx-auto">
                        <Box
                            textAlign="center"
                            className="border-r border-gray-200"
                            sx={{cursor: 'pointer'}}>
                            <Typography variant="h2" fontWeight="bold" >
                                {totalCitasHoy}
                            </Typography>
                            <Typography variant="h5">Citas Hoy</Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography variant="h2" fontWeight="bold">
                                {citasCanceladasHoy.length}
                            </Typography>
                            <Typography variant="h5">Canceladas</Typography>
                        </Box>
                        <Box
                            textAlign="center"
                            gridColumn="span 2"
                            pt={1}
                            borderTop="1px solid #eee">
                            <Typography variant="h2" fontWeight="bold">
                                {totalCitasHoy - citasCanceladasHoy.length}
                            </Typography>
                            <Typography variant="h5">Citas Activas</Typography>
                        </Box>
                    </Box>


                    <Box>
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                            Citas Próximas
                            <Chip
                                label={citasProximas.length}
                                color="secondary"
                                variant="outlined"
                                size="small"
                                sx={{ ml: 1 }}
                            />
                        </Typography>

                        <Box gap={2} sx={{my: 2, display: 'flex', flexDirection: 'column'}}>
                            {citasProximas.map((cita, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        backgroundColor: 'background.paper',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        }}}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {cita.paciente?.nombre || 'Paciente'} {cita.paciente?.apellidos || ''}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {dayjs(cita.fecha).format('DD/MM/YYYY')} - {dayjs(cita.fecha).format('HH:mm')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {cita.motivo || 'Consulta general'}
                                    </Typography>
                                    <Chip
                                        label={cita.estado || 'pendiente'}
                                        color={
                                            cita.estado === 'confirmada' ? 'success' :
                                                cita.estado === 'cancelada' ? 'error' : 'default'
                                        }
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                </Box>
                            ))}

                            {citasProximas.length === 0 && (
                                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                                    No hay citas próximas programadas
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}