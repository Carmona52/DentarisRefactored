import {usuario} from "../auth/auth"
import dayjs from "dayjs";
export interface cita{
    id:number,
    fecha:string,
    hora: string,
    estado: string,
    paciente: usuario,
    dentista: usuario,
    motivo: string
}

export interface updateCita{
    estado:string,
    fecha:dayjs.Dayjs;
    hora: string;
    motivo?: string;
}