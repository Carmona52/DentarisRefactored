import {cita} from "@/types/citas/cita";

const api_url = process.env.NEXT_PUBLIC_CITAS_URL;
if(!api_url) throw new Error("Error en Conectar con el servidor");

