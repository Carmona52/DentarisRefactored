import {usuario} from "../auth/auth"
import dayjs from "dayjs";
export interface cita{
    cita_id:number,
    id:number | string,
    fecha:string,
    hora: string,
    estado: string,
    paciente: usuario,
    dentista: usuario,
    motivo: string
}
export interface data{
    data:cita[]
}


export interface updateCita{
    estado:string,
    fecha:dayjs.Dayjs;
    hora: string;
    motivo?: string;
}