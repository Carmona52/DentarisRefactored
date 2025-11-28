'use client'
import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    MenuItem,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {getDentistas} from "@/lib/db/dentistas/dentistas";
import {getPacientes} from "@/lib/db/pacientes/pacientes";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import {isArray} from "node:util";
import {usuario} from "@/types/auth/auth";

dayjs.locale('es');

interface CitaFormData {
    paciente_id: number;
    dentista_id: number;
    fecha: string;
    hora: string;
    estado: string;
    motivo: string;
}

interface AgendarCitaModalProps {
    open: boolean;
    onClose: () => void;
    onAgendarCita: (citaData: CitaFormData) => void;
}

const motivosCita = [
    {value: 'Consulta general', label: 'Consulta general'},
    {value: 'Limpieza dental', label: 'Limpieza dental'},
    {value: 'Tratamiento de caries', label: 'Tratamiento de caries'},
    {value: 'Extracción dental', label: 'Extracción dental'},
    {value: 'Ortodoncia', label: 'Ortodoncia'},
    {value: 'Otros', label: 'Otros'}
]

// Función auxiliar para validar fecha y hora
const isValidDateTime = (fecha: string, hora: string): boolean => {
    const fechaHoraSeleccionada = dayjs(`${fecha} ${hora}`);
    const ahora = dayjs();
    return fechaHoraSeleccionada.isValid() && fechaHoraSeleccionada.isAfter(ahora);
};

export default function AgendarCitaModal({
                                             open,
                                             onClose,
                                             onAgendarCita,
                                         }: AgendarCitaModalProps) {
    const [formData, setFormData] = useState<CitaFormData>({
        paciente_id: 0,
        dentista_id: 0,
        fecha: dayjs().format('YYYY-MM-DD'),
        hora: dayjs().add(1, 'hour').startOf('hour').format('HH:mm:00'),
        estado: 'Agendada',
        motivo: 'Consulta general'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [newMotivo, setNewMotivo] = useState('');
    const [dentistasData, setDentistasData] = useState<Array<{
        usuario_id: number;
        nombre: string;
        apellidos: string
    }>>([]);
    const [pacientes, setPacientes] = useState<usuario[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dentistasData, pacientesData] = await Promise.all([
                    getDentistas(),
                    getPacientes()
                ]);

                setDentistasData(dentistasData);

                if (Array.isArray(pacientesData)) {
                    setPacientes(pacientesData);
                } else {
                    console.error('Error al obtener pacientes:', pacientesData);
                    setPacientes([]);
                }
            } catch (error) {
                console.error('Error cargando datos:', error);
                setPacientes([]);
                setDentistasData([]);
            }
        };

        if (open) {
            fetchData();
        }
    }, [open]);

    const excludePacientesBaja = pacientes.filter(paciente => paciente.estado !== 'Baja');

    const pacienteOptions = excludePacientesBaja.map((paciente) => ({
        id: paciente.usuario_id,
        label: `${paciente.nombre} ${paciente.apellidos}`
    }));

    const selectedPaciente = pacienteOptions.find(option => option.id === formData.paciente_id) || null;

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleDateChange = (date: dayjs.Dayjs | null) => {
        if (date && date.isValid()) {
            const nuevaFecha = date.format('YYYY-MM-DD');
            handleInputChange('fecha', nuevaFecha);


            if (!isValidDateTime(nuevaFecha, formData.hora)) {
                const horaAjustada = dayjs().add(1, 'hour').startOf('hour').format('HH:mm:00');
                handleInputChange('hora', horaAjustada);
            }
        }
    };

    const handleTimeChange = (time: dayjs.Dayjs | null) => {
        if (time && time.isValid()) {
            handleInputChange('hora', time.format('HH:mm:00'));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        const ahora = dayjs();

        if (!formData.paciente_id) {
            newErrors.paciente_id = 'Selecciona un paciente';
        }

        if (!formData.dentista_id) {
            newErrors.dentista_id = 'Selecciona un dentista';
        }

        if (!formData.fecha) {
            newErrors.fecha = 'Selecciona una fecha';
        } else if (dayjs(formData.fecha).isBefore(ahora, 'day')) {
            newErrors.fecha = 'No puedes agendar citas en fechas pasadas';
        }

        if (!formData.hora) {
            newErrors.hora = 'Selecciona una hora';
        } else {

            const fechaHoraSeleccionada = dayjs(`${formData.fecha} ${formData.hora}`);

            if (fechaHoraSeleccionada.isBefore(ahora)) {
                if (dayjs(formData.fecha).isSame(ahora, 'day')) {
                    newErrors.hora = 'La hora seleccionada ya pasó. Selecciona una hora futura';
                } else {
                    newErrors.fecha = 'No puedes agendar citas en fechas/horas pasadas';
                }
            }
        }

        if (!formData.motivo.trim()) {
            newErrors.motivo = 'El motivo de la consulta es requerido';
        }

        if (formData.motivo === 'Otros' && !newMotivo.trim()) {
            newErrors.motivo = 'Debes especificar el motivo de la consulta';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        const datosFinales = {
            ...formData,
            motivo: formData.motivo === 'Otros' ? newMotivo : formData.motivo
        };

        if (!validateForm()) return;

        setLoading(true);
        try {
            await onAgendarCita(datosFinales);
            handleClose();
        } catch (error) {
            console.error('Error al agendar cita:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            paciente_id: 0,
            dentista_id: 0,
            fecha: dayjs().format('YYYY-MM-DD'),
            hora: dayjs().add(1, 'hour').startOf('hour').format('HH:mm:00'),
            estado: 'Agendada',
            motivo: 'Consulta general'
        });
        setNewMotivo('');
        setErrors({});
        onClose();
    };


    const getMinTime = () => {
        const hoy = dayjs();
        const fechaSeleccionada = dayjs(formData.fecha);

        if (fechaSeleccionada.isSame(hoy, 'day')) {

            return hoy.add(1, 'hour').startOf('hour');
        }

        return dayjs().startOf('day');
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth>
            <DialogTitle>
                <Typography fontWeight="bold">
                    Agendar Nueva Cita
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box component="form" sx={{mt: 2}}>
                    <Autocomplete
                        disablePortal
                        options={pacienteOptions}
                        value={selectedPaciente}
                        onChange={(event, newValue) => {
                            handleInputChange('paciente_id', newValue ? newValue.id : 0);
                        }}
                        sx={{mb: 2}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Paciente *"
                                error={!!errors.paciente_id}
                                helperText={errors.paciente_id}
                            />
                        )}
                    />

                    <FormControl fullWidth error={!!errors.dentista_id} sx={{mb: 3}}>
                        <InputLabel>Dentista *</InputLabel>
                        <Select
                            value={formData.dentista_id}
                            label="Dentista *"
                            onChange={(e) => handleInputChange('dentista_id', Number(e.target.value))}>
                            <MenuItem value={0}>
                                <em>Selecciona un dentista</em>
                            </MenuItem>
                            {dentistasData.map((dentista) => (
                                <MenuItem key={dentista.usuario_id} value={dentista.usuario_id}>
                                    {dentista.nombre} {dentista.apellidos}
                                </MenuItem>))}
                        </Select>
                        {errors.dentista_id && (
                            <Typography variant="caption" color="error">
                                {errors.dentista_id}
                            </Typography>)}
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3}}>
                            <DatePicker
                                label="Fecha *"
                                value={dayjs(formData.fecha)}
                                onChange={handleDateChange}
                                minDate={dayjs()}
                                slotProps={{
                                    textField: {
                                        error: !!errors.fecha,
                                        helperText: errors.fecha,
                                        fullWidth: true
                                    }
                                }}/>

                            <TimePicker
                                label="Hora *"
                                value={dayjs(`2000-01-01 ${formData.hora}`)} // Usar fecha fija para evitar problemas de fecha
                                onChange={handleTimeChange}
                                minTime={getMinTime()}
                                slotProps={{
                                    textField: {
                                        error: !!errors.hora,
                                        helperText: errors.hora,
                                        fullWidth: true
                                    }
                                }}/>
                        </Box>
                    </LocalizationProvider>

                    <FormControl fullWidth error={!!errors.motivo} sx={{mb: 3}}>
                        <InputLabel>Motivo de la Consulta *</InputLabel>
                        <Select
                            value={formData.motivo}
                            label="Motivo de la Consulta *"
                            onChange={(e) => handleInputChange('motivo', e.target.value)}>
                            {motivosCita.map((motivo) => (
                                <MenuItem key={motivo.value} value={motivo.value}>
                                    {motivo.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.motivo && (
                            <Typography variant="caption" color="error">
                                {errors.motivo}
                            </Typography>
                        )}
                    </FormControl>

                    {formData.motivo === 'Otros' && (
                        <TextField
                            fullWidth
                            label="Especifica el motivo de la consulta *"
                            value={newMotivo}
                            onChange={(e) => setNewMotivo(e.target.value)}
                            error={!!errors.motivo}
                            helperText={errors.motivo}
                            sx={{mb: 2}}
                        />
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{p: 3, gap: 1}}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="secondary"
                    disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{minWidth: 120}}>
                    {loading ? 'Agendando...' : 'Agendar Cita'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}