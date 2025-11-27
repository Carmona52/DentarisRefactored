export interface usuario {
    updated_at?: string;
    created_at?: string;
    usuario_id: number;
    rol_id: number;
    consultorio_id: number;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    fecha_nacimiento: string;
    genero: "F" | "M" | "Otro";
    pais_origen: string;
    direccion: string;
    notas: string;
    alergias: string[];
    carrera?: string;
    numero_identificacion: string;
    profesion?: string;
    cedula_profesional?: string
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
