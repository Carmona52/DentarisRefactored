'use client'
import {useRouter, useParams} from 'next/navigation';
export default function HistorialMedicoPage(){
    const params = useParams<{ id: string }>()
    const id = Number(params.id)

    return(
        <>
        <h1>Historial Médico {id}</h1>
        </>
    )
}