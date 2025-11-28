'use server'
import {createUser, usuario} from "@/types/auth/auth";
import {cookies} from 'next/headers'

const apiUrl = process.env.NEXT_PUBLIC_USUARIOS_URL;
if (!apiUrl) throw new Error("API URL no configurada");

interface response {
    success: boolean;
    paciente: object;
}

export const getPacientes = async (): Promise<usuario[] | string> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return "No se encontró token de autenticación";
        }


        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return `Error: ${response.status}`;
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.pacientes)) {
            return result.pacientes;
        } else {
            return "Estructura de datos inesperada";
        }

    } catch (error) {
        console.error("Error completo:", error);
        return "Error de conexión";
    }
};

export const getPacienteById = async (id: number): Promise<response> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) throw new Error("No se encontró token de autenticación");

        const newApiUrl = `${apiUrl}/${id}`;

        const response = await fetch(newApiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.json();
    }catch(error) {throw new Error("Error al obtener al Paciente" + error);}

}

export const createPaciente = async (data: createUser): Promise<createUser> => {
    const apiUrl = process.env.NEXT_PUBLIC_REGISTERUSER_URL;
    if (!apiUrl) throw new Error("Error de Conexión con el Servidor");
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) throw new Error("No se encontró token de autenticación");

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono,
                fecha_nacimiento: data.fecha_nacimiento,
                genero: data.genero,
                pais_origen: data.pais_origen,
                direccion: data.direccion,
                alergias: data.alergias,
                carrera: data.carrera,
                numero_identificacion: data.numero_identificacion,
                profesion: data.profesion,
                nombre_contacto_emergencia: data.nombre_contacto_emergencia,
                telefono_contacto_emergencia: data.telefono_contacto_emergencia,
                rol: data.rol ?? "Paciente",
                notas: data.notas,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) as createUser;
    } catch (error) {
        throw new Error("Error al crear el Paciente: " + String(error));
    }
};
