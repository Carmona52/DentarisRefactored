
import {data, cita} from "@/types/citas/cita";

import axios from "axios";

const api_url = process.env.NEXT_PUBLIC_CITAS_URL;
if(!api_url) throw new Error("Error en Conectar con el servidor");


const errorMessage = "Error de Conexión con el servidor";

export const getCitas = async ():Promise<cita[] | string>=> {

    try{
        const data = await axios.get<data>(api_url);

        if(data.status !== 200){
            return errorMessage;
        }

        const newData = data.data;
        return newData.data;

    }catch (error){
        return errorMessage + error;
    }
}

export const getCitasDetalle= async ():Promise<cita[] | string> => {
    const api_url_detalle = `${api_url}/detalle`;
    try {
        const data = await axios.get<data>(api_url_detalle);
        if(data.status !== 200){
            return errorMessage;
        }

        const newData = data.data;
        return newData.data;
    }catch (error){
        return errorMessage + error;
    }
}