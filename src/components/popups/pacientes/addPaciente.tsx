'use client'
import React, {useState} from 'react';
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
    Select,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {createPaciente} from "@/lib/db/pacientes/pacientes";
import dayjs, {Dayjs} from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface GuardarPacienteModalProps {
    open: boolean;
    onClose: () => void;
    onPacienteCreado?: () => void
}

const generos = [
    {id: 1, value: 'M', label: 'Masculino'},
    {id: 2, value: 'F', label: 'Femenino'},
    {id: 3, value: 'O', label: 'Otro'},
];

const paises = [{id: 1, value: 'Mexico', label: 'México'}];

export default function GuardarPacienteModal({open, onClose, onPacienteCreado}: GuardarPacienteModalProps) {
    const [fechaNacimiento, setFechaNacimiento] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as "success" | "error" | "warning" | "info",
    });

    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        genero: '',
        pais_origen: '',
        direccion: '',
        alergias: [] as string[],
        numero_identificacion: '',
        profesion: '',
        nombre_contacto_emergencia: '',
        telefono_contacto_emergencia: '',
        notas: '',
    });

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({open: true, message, severity});
    };

    const handleCloseSnackbar = () => {
        setSnackbar({...snackbar, open: false});
    };

    const handleClose = () => {
        onClose();
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({...prev, [field]: value}));
    };

    const validateForm = () => {
        if (!formData.nombre.trim()) return "El nombre es obligatorio";
        if (!formData.apellidos.trim()) return "Los apellidos son obligatorios";
        if (!formData.email.trim()) return "El email es obligatorio";
        if (!formData.telefono.trim()) return "El teléfono es obligatorio";
        if (!fechaNacimiento) return "La fecha de nacimiento es obligatoria";
        if (!formData.genero) return "El género es obligatorio";
        if (!formData.direccion.trim()) return "La dirección es obligatoria";

        return null;
    };

    const savePaciente = async () => {
        const errorMsg = validateForm();
        if (errorMsg) {
            showSnackbar(errorMsg, "error");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                fecha_nacimiento: fechaNacimiento ? fechaNacimiento.format("YYYY-MM-DD") : "",
                alergias: formData.alergias.join(", "),
            };

            await createPaciente(payload);

            showSnackbar("Paciente registrado correctamente", "success");
            onPacienteCreado?.();
            handleClose();

        } catch (error: any) {
            console.error(error);

            const apiMessage =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                error?.message;

            const finalMessage = apiMessage || "Error al registrar el paciente";


            showSnackbar(finalMessage, "error");

        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {/* MODAL */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography fontWeight="bold">Registrar Nuevo Paciente</Typography>
                </DialogTitle>

                <DialogContent>
                    <Box component="form" sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 3}}>
                        <Typography variant="h6" fontWeight="bold">Información Personal</Typography>

                        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2}}>
                            <TextField
                                label="Nombre *"
                                fullWidth
                                value={formData.nombre}
                                onChange={(e) => handleChange('nombre', e.target.value)}
                            />
                            <TextField
                                label="Apellidos *"
                                fullWidth
                                value={formData.apellidos}
                                onChange={(e) => handleChange('apellidos', e.target.value)}
                            />
                        </Box>

                        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2}}>
                            <TextField
                                label="Email *"
                                type="email"
                                fullWidth
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                            <TextField
                                label="Teléfono *"
                                fullWidth
                                value={formData.telefono}
                                onChange={(e) => handleChange('telefono', e.target.value)}
                            />
                        </Box>

                        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <DatePicker
                                    label="Fecha de Nacimiento *"
                                    maxDate={dayjs()}
                                    value={fechaNacimiento}
                                    onChange={setFechaNacimiento}
                                    slotProps={{textField: {fullWidth: true}}}
                                />
                            </LocalizationProvider>

                            <FormControl fullWidth>
                                <InputLabel>Género del Paciente *</InputLabel>
                                <Select
                                    value={formData.genero}
                                    onChange={(e) => handleChange('genero', e.target.value)}
                                    label="Género del Paciente"
                                >
                                    {generos.map((g) => (
                                        <MenuItem key={g.id} value={g.value}>
                                            {g.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Typography variant="h6" fontWeight="bold">Dirección</Typography>

                        <TextField
                            label="Dirección *"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.direccion}
                            onChange={(e) => handleChange('direccion', e.target.value)}
                        />

                        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2}}>
                            <FormControl fullWidth>
                                <InputLabel>País de Origen</InputLabel>
                                <Select
                                    value={formData.pais_origen}
                                    onChange={(e) => handleChange('pais_origen', e.target.value)}
                                    label="País de Origen"
                                >
                                    {paises.map((pais) => (
                                        <MenuItem key={pais.id} value={pais.value}>
                                            {pais.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Número de Identificación"
                                fullWidth
                                value={formData.numero_identificacion}
                                onChange={(e) => handleChange('numero_identificacion', e.target.value)}
                            />
                        </Box>

                        <Typography variant="h6" fontWeight="bold">Contacto de Emergencia</Typography>

                        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2}}>
                            <TextField
                                label="Nombre del Contacto"
                                fullWidth
                                value={formData.nombre_contacto_emergencia}
                                onChange={(e) =>
                                    handleChange('nombre_contacto_emergencia', e.target.value)
                                }
                            />
                            <TextField
                                label="Teléfono de Emergencia"
                                fullWidth
                                value={formData.telefono_contacto_emergencia}
                                onChange={(e) =>
                                    handleChange('telefono_contacto_emergencia', e.target.value)
                                }
                            />
                        </Box>

                        <Typography variant="h6" fontWeight="bold">Información Adicional</Typography>

                        <TextField
                            label="Alergias (separadas por coma)"
                            fullWidth
                            value={formData.alergias.join(', ')}
                            onChange={(e) =>
                                handleChange(
                                    'alergias',
                                    e.target.value.split(',').map((a) => a.trim())
                                )
                            }
                        />

                        <TextField
                            label="Notas Adicionales"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.notas}
                            onChange={(e) => handleChange('notas', e.target.value)}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{p: 3, gap: 1}}>
                    <Button onClick={handleClose} variant="outlined" color="secondary">
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        sx={{minWidth: 120}}
                        onClick={savePaciente}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar Paciente"}
                    </Button>
                </DialogActions>
            </Dialog>


            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
