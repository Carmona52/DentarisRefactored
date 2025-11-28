'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {cita} from "@/types/citas/cita";
import {usuario} from "@/types/auth/auth";
import {useRouter} from "next/navigation";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');


const getGenderText = (genero: string) =>
    genero === "M" ? "Masculino" : "Femenino";

interface DataGridDemoProps {
    data: usuario[]
}

const columns: GridColDef<usuario>[] = [
    {
        field: 'nombre',
        headerName: 'Nombre',
        flex: 1,
        maxWidth: 180,
        editable: false,
        valueGetter: (value: cita, row) => `${row.nombre || ''}`,
    },
    {
        field: 'apellidos',
        headerName: 'Apellidos',
        flex: 1,
        maxWidth: 180,
        editable: false,
        valueGetter: (value, row) => `${row.apellidos || ''}`,
    },
    {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        maxWidth: 250,
        type: 'string',
        editable: false,
        valueGetter: (value, row) => `${row.email || ''}`,
    },
    {
        field: 'fecha_nacimiento',
        headerName: 'Fecha de Nacimiento',
        flex: 1,
        maxWidth: 160,
        type: 'string',
        editable: false,
        valueGetter: (value, row) => dayjs(row.fecha_nacimiento).format('D [de] MMMM [de] YYYY'),
    },
    {
        field: 'genero',
        headerName: 'Género',
        flex: 1,
        minWidth: 100,
        maxWidth: 130,
        valueGetter: (_, row) => getGenderText(row.genero),
    },
    {
        field: 'telefono',
        headerName: 'Número de Teléfono',
        flex: 1,
        maxWidth: 180,
        type: 'string',
        editable: false,
        valueGetter: (value, row) => `${row.telefono || 'No proporcionado'}`,
    },

    {
        field: 'estado',
        headerName: 'Estado del Paciente',
        flex: 1,
        maxWidth: 180,
        type: 'string',
        editable: false,
        valueGetter: (value, row) => `${row.estado?.toString()|| 'Desconocido'}`,
        renderCell: (params) => {
            const estado = params.value as string;
            let color = '';
            let bgColor = '';

            switch (estado?.toLowerCase()) {
                case 'activo':
                    color = '#155724';
                    bgColor = '#d4edda';
                    break;
                case 'baja':
                    color = '#721c24';
                    bgColor = '#f8d7da';
                    break;
                case 'confirmada':
                    color = '#004085';
                    bgColor = '#cce5ff';
                    break;
                default:
                    color = '#383d41';
                    bgColor = '#e2e3e5';
            }
            return (
                <Box
                    sx={{
                        backgroundColor: bgColor,
                        color: color,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>
                    {params.value}
                </Box>
            );
        }
    }
    , {
        field: 'actions',
        headerName: 'Acciones',
        type: 'actions',
        flex: 1,
        valueGetter: (value, row) => row.usuario_id,
        renderCell: (params) => {
            const citaId = params.value as string;

            return (
                <Button color="primary" size='large' onClick={() => {
                    window.location.href = `/pacientes/${citaId}`
                }}>
                    Información Detallada
                </Button>
            );
        }
    }
];

export function TableWithButtonPatient({data}: DataGridDemoProps) {
    return (
        <Box sx={{minWidth: '100%'}}>
            <DataGrid
                getRowId={(data) => data.usuario_id}
                rows={data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 15, 25]}
                disableRowSelectionOnClick
                disableColumnSelector
                showToolbar
            />
        </Box>
    );
}