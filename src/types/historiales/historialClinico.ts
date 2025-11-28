export interface historialClinico {
    historial_id: number;
    paciente_id: number;
    dentista_id: number;
    consultorio_id: number;
    cita_id: number;
    motivo_consulta: string;
    padecimiento_actual: string | null;
    signos_vitales_json: string | null;
    exploracion_oral_json: string | null;
    diagnostico_presuntivo: string | null;
    diagnostico_definitivo: string | null;
    codigos_diagnostico: string | null;
    plan_resumen: string | null;
    pronostico: string | null;
    indicaciones: string | null;
    firmado_por: string | null;
    firmado_en: string | null;
    version: number;
    locked: number;
    enc_key_id: string;
    created_at: string;
    updated_at: string;
}

export interface data{
    success:string;
    data:historialClinico[]
}

export interface oneData{
    success:string;
    data:historialClinico;
}