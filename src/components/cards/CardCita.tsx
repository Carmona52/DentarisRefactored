import React from 'react';
import {Card, Typography, Box} from '@mui/material';
import {cita} from "@/types/citas/cita";
import dayjs from 'dayjs';
import 'dayjs/locale/es';

import {
    CalendarMonth as CalendarMonthIcon,
    AccessTime as AccessTimeIcon,
    Person as PersonIcon,
} from '@mui/icons-material';

interface Props {
    cita: cita;
}

dayjs.locale('es')

const CardCita: React.FC<Props> = ({cita}) => {
    const fechaFormateada = dayjs(cita.fecha).format('D [de] MMMM [de] YYYY');
    const horaFormateada = cita.hora.slice(0, 5);

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                p: 3,
                bgcolor: '#ffffff',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                },
            }}
        >
            <Box display="flex" alignItems="center" mb={2}>
                <Box sx={{width:48, height:48, borderRadius: 4, backgroundColor:"#e0f7fa", display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight:2}}>
                    <PersonIcon sx={{color: '#00796b'}}/>
                </Box>
                <Box>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                        {cita.paciente.nombre} {cita.paciente.apellidos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {cita.motivo}
                    </Typography>
                </Box>
            </Box>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#f9fafb"
                px={2}
                py={1.5}
                borderRadius={3}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <CalendarMonthIcon sx={{fontSize: 20, color: '#1976d2'}}/>
                    <Typography variant="body2" fontWeight="medium" color="text.primary">
                        {fechaFormateada}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon sx={{fontSize: 20, color: '#1976d2'}}/>
                    <Typography variant="body2" fontWeight="medium" color="text.primary">
                        {horaFormateada}
                    </Typography>
                </Box>
            </Box>
        </Card>


    );
};

export default CardCita;