'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {cita} from "@/types/citas/cita";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');


interface DataGridDemoProps {
    data: cita[];
}

const columns: GridColDef<cita>[] = [
    {
        field: 'nombre',
        headerName: 'Nombre',
        flex: 1,
        maxWidth: 180,
        editable: false,
        valueGetter: (value: cita, row) => `${row.paciente.nombre || ''}`,
    },
    {
        field: 'apellidos',
        headerName: 'Apellidos',
        flex: 1,
        maxWidth: 180,
        editable: false,
        valueGetter: (value, row) => `${row.paciente.apellidos || ''}`,
    },
    {
        field: 'motivo',
        headerName: 'Motivo de la Consulta',
        flex: 1,
        maxWidth: 250,
        type: 'string',
        editable: false,
        valueGetter: (value, row) => `${row.motivo || 'a'}`,
    },
    {
        field: 'fecha',
        headerName: 'Fecha de la Consulta',
        flex: 1,
        maxWidth: 160,
        type: 'string',
        editable: false,
        valueGetter: (value, row) => dayjs(row.fecha).format('D [de] MMMM [de] YYYY'),
    },
    {
        field: 'hora',
        headerName: 'Hora Consulta',
        type: 'string',
        flex: 1,
        maxWidth: 130,
        editable: false,
        valueGetter: (value, row) => row.hora.slice(0, 5),
    },
    {
        field: 'dentista',
        headerName: 'Dentista Asignado',
        flex: 1,
        maxWidth: 200,
        type: 'string',
        editable: false,
        valueGetter: (value, row) => `${row.dentista.nombre || 'a'} ${row.dentista.apellidos || ''}`.trim(),
    },
    {
        field: 'estado',
        headerName: 'Estado de la Consulta',
        flex: 1,
        maxWidth: 180,
        type: 'string',
        editable: false,
        valueGetter: (value, row) => `${row.estado || 'a'}`,
        renderCell: (params) => {
            const estado = params.value as string;
            let color = '';
            let bgColor = '';

            switch (estado?.toLowerCase()) {
                case 'realizada':
                    color = '#155724';
                    bgColor = '#d4edda';
                    break;
                case 'pendiente':
                    color = '#856404';
                    bgColor = '#fff3cd';
                    break;
                case 'cancelada':
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
    },
    {
        field: 'actions',
        headerName: 'Acciones',
        type: 'actions',
        flex: 1,
        valueGetter: (value, row) => row.cita_id,
        renderCell: (params) => {
            const citaId = params.value as string;

            const handleViewDetails = () => {
                console.log('Ver detalles de la cita con ID:', citaId);
            };

            return (
                <Button color="primary" onClick={handleViewDetails} size='large'>
                    Ver Detalles
                </Button>
            );
        }
    }
];

export function TableWithButton({data}: DataGridDemoProps) {

    return (
        <Box sx={{ minWidth: '100%'}}>
            <DataGrid
                getRowId={(data) => data.cita_id}
                rows={data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[5,10, 15, 25]}
                disableRowSelectionOnClick
                disableColumnSelector
                showToolbar
            />
        </Box>
    );
}