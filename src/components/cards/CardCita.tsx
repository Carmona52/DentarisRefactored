import React from 'react';
import { Card, CardContent, Typography, Divider } from '@mui/material';
import {cita} from "@/types/citas/cita";
import dayjs from 'dayjs';

interface Props {
    cita: cita;
}

const CardCita: React.FC<Props> = ({ cita }) => {
    const fechaFormateada = dayjs(cita.fecha).format('DD/MM/YYYY');
    const horaFormateada = cita.hora.slice(0, 5);

    return (
        <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    🦷 Cita #{cita.id}
                </Typography>

                <Typography variant="body2">
                    <strong>Fecha:</strong> {fechaFormateada}
                </Typography>
                <Typography variant="body2">
                    <strong>Hora:</strong> {horaFormateada}
                </Typography>
                <Typography variant="body2">
                    <strong>Estado:</strong> {cita.estado}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="body2">
                    <strong>Paciente:</strong> {cita.paciente.nombre} ({cita.paciente.email})
                </Typography>
                <Typography variant="body2">
                    <strong>Dentista:</strong> {cita.dentista.nombre} ({cita.dentista.email})
                </Typography>

                {cita.motivo && (
                    <>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                            <strong>Motivo:</strong> {cita.motivo}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default CardCita;