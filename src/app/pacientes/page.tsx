'use client'
import { getPacientes } from "@/lib/db/pacientes/pacientes";
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import { usuario } from "@/types/auth/auth";
import {TableWithButtonPatient} from "@/TablesPacientes/TableWithButton";
import { Typography } from "@mui/material";

export default function PacientesPage() {
    const router = useRouter();
    const [pacientes, setPacientes] = useState<usuario[]>([]);

    useEffect(() => {
        const fetchPacientes = async () => {
            const data = await getPacientes();
            if (Array.isArray(data)) {
                setPacientes(data);
            } else {
                console.error("Error al obtener pacientes:", data);
            }
        };
        fetchPacientes();
    }, []);

    return (
        <>
            <Typography variant='h2' sx={{fontWeight:'bold', textAlign:'center', my:2}}>Lista de Pacientes</Typography>
           <TableWithButtonPatient data={pacientes}/>
        </>
    );
}