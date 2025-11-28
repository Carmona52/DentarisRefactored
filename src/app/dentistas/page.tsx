'use client'
import {usuario} from "@/types/auth/auth";
import {getDentistas} from "@/lib/db/dentistas/dentistas";
import {TableWithButtonDentistas} from "@/Tables/tablasDentistas/TableWithButton";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";

export default function DentistasPage() {
    const [dentistas, setDentistas] = useState<usuario[]>([]);
    const getData = async () => {
        const data = await getDentistas();
        setDentistas(data);
    }

    useEffect(() => {
        getData();
    }, []);
    return (
        <>
            <Box>
                <Typography variant='h2' fontWeight='bold' textAlign='center' sx={{my:2}}> Dentistas</Typography>
                <TableWithButtonDentistas data={dentistas}/>
            </Box>
        </>
    )
}