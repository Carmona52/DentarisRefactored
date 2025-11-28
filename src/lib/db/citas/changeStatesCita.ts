const apiUrl = process.env.NEXT_PUBLIC_CITAS_URL;
if (!apiUrl) throw new Error("API URL no configurada");

export async function setCitaRealizada(id:number) {
    try{
        const updateCita = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({estado: 'Realizada'}),
        })

        if (!updateCita) {
            throw new Error("No se pudo cambiar el estado de la cita");
        }
        return updateCita;

    }catch (error){
        throw new Error("Error al cambiar el estado de la cita: " + error);
    }
}

export async function setIniciarCita(id:number) {
    try{
        const updateCita = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({estado: 'En proceso'}),
        })

        if (!updateCita) {
            throw new Error("No se pudo cambiar el estado de la cita");
        }
        return updateCita;

    }catch (error){
        throw new Error("Error al cambiar el estado de la cita: " + error);
    }
}