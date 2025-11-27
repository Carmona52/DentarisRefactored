'use client'
import React, {useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

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
    pacientes: Array<{ usuario_id: number; nombre: string; apellidos: string }>;
    dentistas: Array<{ usuario_id: number; nombre: string; apellidos: string }>;
}

const motivosCita = [
    {value: 'Consulta general', label: 'Consulta general'},
    {value: 'Limpieza dental', label: 'Limpieza dental'},
    {value: 'Tratamiento de caries', label: 'Tratamiento de caries'},
    {value: 'Extracción dental', label: 'Extracción dental'},
    {value: 'Ortodoncia', label: 'Ortodoncia'},
    {value: 'Otros', label: 'Otros'}
]

export default function AgendarCitaModal({
                                             open,
                                             onClose,
                                             onAgendarCita,
                                             pacientes,
                                             dentistas
                                         }: AgendarCitaModalProps) {
    const [formData, setFormData] = useState<CitaFormData>({
        paciente_id: 0,
        dentista_id: 0,
        fecha: dayjs().format('YYYY-MM-DD'),
        hora: '09:00:00',
        estado: 'Agendada',
        motivo: 'Consulta general'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [newMotivo, setNewMotivo] = useState('');

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
            handleInputChange('fecha', date.format('YYYY-MM-DD'));
        }
    };

    const handleTimeChange = (time: dayjs.Dayjs | null) => {
        if (time && time.isValid()) {
            handleInputChange('hora', time.format('HH:mm:00'));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.paciente_id) {
            newErrors.paciente_id = 'Selecciona un paciente';
        }

        if (!formData.dentista_id) {
            newErrors.dentista_id = 'Selecciona un dentista';
        }

        if (!formData.fecha) {
            newErrors.fecha = 'Selecciona una fecha';
        } else if (dayjs(formData.fecha).isBefore(dayjs(), 'day')) {
            newErrors.fecha = 'No puedes agendar citas en fechas pasadas';
        }

        if (!formData.hora) {
            newErrors.hora = 'Selecciona una hora';
        }

        if (!formData.motivo.trim()) {
            newErrors.motivo = 'El motivo de la consulta es requerido';
        }

        if(formData.motivo === 'Otros') {
            formData.motivo = newMotivo;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await onAgendarCita(formData);
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
            hora: '09:00:00',
            estado: 'Agendada',
            motivo: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth>
            <DialogTitle>
                <Typography variant="h5" fontWeight="bold">
                    Agendar Nueva Cita
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box component="form" sx={{mt: 2}}>
                    <FormControl fullWidth error={!!errors.paciente_id} sx={{mb: 3}}>
                        <InputLabel>Paciente *</InputLabel>
                        <Select
                            value={formData.paciente_id}
                            label="Paciente *"
                            onChange={(e) => handleInputChange('paciente_id', Number(e.target.value))}>
                            <MenuItem value={0}>
                                <em>Selecciona un paciente</em>
                            </MenuItem>
                            {pacientes.map((paciente) => (
                                <MenuItem key={paciente.usuario_id} value={paciente.usuario_id}>
                                    {paciente.nombre} {paciente.apellidos}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.paciente_id && (
                            <Typography variant="caption" color="error">
                                {errors.paciente_id}
                            </Typography>)}
                    </FormControl>

                    <FormControl fullWidth error={!!errors.dentista_id} sx={{mb: 3}}>
                        <InputLabel>Dentista *</InputLabel>
                        <Select
                            value={formData.dentista_id}
                            label="Dentista *"
                            onChange={(e) => handleInputChange('dentista_id', Number(e.target.value))}>
                            <MenuItem value={0}>
                                <em>Selecciona un dentista</em>
                            </MenuItem>
                            {dentistas.map((dentista) => (
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
                            {/* Fecha */}
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
                                value={dayjs(`2025-01-01 ${formData.hora}`)}
                                onChange={handleTimeChange}
                                slotProps={{
                                    textField: {
                                        error: !!errors.hora,
                                        helperText: errors.hora,
                                        fullWidth: true
                                    }
                                }}/>
                        </Box>
                    </LocalizationProvider>

                    <FormControl fullWidth sx={{mb: 3}}>
                        <InputLabel>Motivo de la Consulta</InputLabel>
                        <Select
                            value={formData.motivo}
                            label="Motico de la Consulta"
                            onChange={(e) => handleInputChange('motivo', e.target.value)}>
                            {motivosCita.map((motivo) => (
                                <MenuItem key={motivo.value} value={motivo.value}>
                                    {motivo.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/*Aquí ingreso una nueva entrada de texto por si no cumple la expectativa*/}
                    {formData.motivo === 'Otros' ?
                        <TextField sx={{width: '100%'}} label={"Ingrese el motivo de la consulta"}
                                   onChange={(e) => setNewMotivo(e.target.value)}></TextField> : null}
                </Box>
            </DialogContent>

            <DialogActions sx={{p: 3, gap: 1}}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
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