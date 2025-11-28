import {historialClinico} from '@/types/historiales/historialClinico';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_HISTORIAS_CLINICAS_URL;
const ANTECENENTES_API_URL = process.env.NEXT_PUBLIC_CREAR_ANTECEDENTES_URL;
if (!API_URL ) throw new Error("Missing API URL for historias clinicas");
if(!ANTECENENTES_API_URL) throw new Error("Missing API URL for historias clinicas");

type ApiResponse = {
    id: number;
    success: boolean;
    data: Record<string, any>;
};

const createAntecedentes = async (id: number) => {
    const newUrl = `${ANTECENENTES_API_URL}/${id}`;
    try {
        const antecedentesData = {
            heredofamiliares: {
                diabetes: true,
                hipertension: false
            },
            personales_patologicos: {
                asma: false,
                epilepsia: false
            },
            personales_no_patol: {
                actividad_fisica: "moderada"
            },
            alergias: {
                penicilina: true,
                nsaids: false
            },
            medicacion_actual: [{
                nombre: "ibuprofeno",
                dosis: "400mg",
                frecuencia: "cada 8h"
            }],
            quirurgicos: [{
                procedimiento: "apendicectomía",
                año: 2020
            }],
            habitos: {
                tabaquismo: "no",
                alcohol: "ocasional"
            },
            alertas_clinicas: ["riesgo sangrado"],
            updated_by: 1
        };

        const response = await axios.put(newUrl, antecedentesData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error("Error al crear antecedentes");
        }

        return response;
    } catch (error) {
        throw new Error("Error de conexión con el servidor al crear antecedentes: " + error);
    }
};

export const getHistorialMedicoById = async (pacienteId: number): Promise<historialClinico> => {
    try {
        const response = await axios.get(`${API_URL}?paciente_id=${pacienteId}`);
        if (response.status !== 200) {
            throw new Error("Error al obtener el historial médico");
        }

        const historial = response.data.data[0];
        await createAntecedentes(pacienteId)
        return historial;
    } catch (error) {
        throw new Error("Error de conexión con el servidor: " + error);
    }
};


export const getAntecedentes = async ( id:number) =>{
    const newUrl = `${ANTECENENTES_API_URL}/${id}`;
    const response =await axios.get(newUrl)
    if (response.status !== 200) {
        throw new Error("Error al obtener el historial médico");
    }
    const antecedentes = response.data.data;
    return antecedentes;
}