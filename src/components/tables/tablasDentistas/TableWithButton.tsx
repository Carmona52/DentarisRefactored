'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {usuario} from "@/types/auth/auth";
import {useRouter} from "next/navigation";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface DataGridDemoProps { data: usuario[] }

const columns: GridColDef<usuario>[] = [
    {
        field: 'nombre',
        headerName: 'Nombre',
        flex: 1,
        maxWidth: 180,
        editable: false,
        valueGetter: (value: usuario, row) => `${row.nombre || ''}`,
    },
    {
        field: 'apellidos',
        headerName: 'Apellidos',
        flex: 1,
        maxWidth: 180,
        editable: false,
    },
    {
        field: 'carrera',
        headerName: 'Carrera',
        flex: 1,
        maxWidth: 250,
        type: 'string',
        editable: false,
    },
    {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        maxWidth: 200,
        type: 'string',
        editable: false,
    },
    {
        field: 'telefono',
        headerName: 'Teléfono',
        flex: 1,
        maxWidth: 150,
        type: 'string',
        editable: false,
    },
    {
        field:'cedula_profesional',
        headerName: 'Cédula Profesional',
        flex: 1,
        maxWidth: 180,
        type: 'string',
        editable: false,
    },
    {
        field:'created_at',
        headerName: 'Fecha de Registro',
        flex: 1,
        maxWidth: 180,
        type: 'string',
        editable: false,
        valueGetter: (value: usuario, row) => dayjs(row.created_at).locale('es').format('DD MMMM YYYY').toLocaleUpperCase(),
    },
    {
        field: 'actions',
        headerName: 'Acciones',
        type: 'actions',
        flex: 1,
        valueGetter: (value, row) => row.usuario_id,
        renderCell: (params) => {
            const citaId = params.value as string;

            return (
                <Button color="primary" size='large' onClick={() => {
                    window.location.href = `/dentistas/${citaId}`
                }}>
                    Ver Más
                </Button>
            );
        }
    }
];

export function TableWithButtonDentistas({data}: DataGridDemoProps) {
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