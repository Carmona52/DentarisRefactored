export interface usuario {
    usuario_id: number;
    rol_id: number;
    consultorio_id: number;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    fecha_nacimiento: string;
    genero: "Femenino" | "Masculino" | "Otro";
    pais_origen: string;
    direccion: string;
    notas: string;
    alergias: string[];
    profesion: string;
    numero_identificacion: string;
    nombre_contacto_emergencia: string;
    telefono_contacto_emergencia: string;
    last_login: string;
    token?: string;
    success: boolean;
}

export interface clinica {
    success: boolean;
    clinica_name: string;
    telefono: string;
    email: string;
    password: string;
    rol: string;
}
