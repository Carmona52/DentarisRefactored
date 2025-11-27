'use server'
import {usuario} from "@/types/auth/auth";
import {cookies} from 'next/headers'

const api_url = process.env.NEXT_PUBLIC_DENTISTAS_URL;
if(!api_url) throw new Error("Error en Conectar con el servidor");

export const getDentistas = async() => {

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
        throw new Error("Error en Conectar con el servidor");
    }

    try{
        const response = await fetch(api_url,
            {
                headers:{Authorization: `Bearer ${token}`}
            });
        if(!response.ok){
            throw new Error("Error en Conectar con el servidor: " + response.statusText);
        }
        const data = await response.json();
        return data.dentists as usuario[];

    }catch(error){
        throw new Error("Error en Conectar con el servidor" + error);
    }
}

export const getDentistaById = async(dentistaId: number) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) throw new Error("Error en Conectar con el servidor");

    try{
        const response = await fetch(`${api_url}/${dentistaId}`, {
            headers:{Authorization: `Bearer ${token}`}
        })

        if(!response.ok) throw new Error("Error en Conectar con el servidor: " + response.statusText);

        const data = await response.json();
        return data.dentist as usuario;

    }catch (error) {
        throw new Error("Error en Conectar con el servidor" + error);
    }
}