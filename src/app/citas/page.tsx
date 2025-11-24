'use client'
import {getCitasDetalle} from "@/lib/db/citas/getCitas";
import {SimpleTable} from "@/Tables/tablasCitas/SimpleTable";
import {TableWithButton} from "@/Tables/tablasCitas/TableWithButton";
import {useEffect, useState} from "react";
import {cita} from "@/types/citas/cita";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function CitasPage() {
    const [citaDetalle, setCitaDetalle] = useState<cita[]>([]);

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
            <Box>
                <Typography variant="h2" sx={{textAlign: 'center', fontWeight: 'bold'}}>Historico de Citas
                    Médicas</Typography>
                <TableWithButton data={citaDetalle}/>
            </Box>

        </>
    );
}
