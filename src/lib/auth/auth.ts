import axios from "axios";
import {usuario} from "@/types/auth/auth";
import {clinica} from "@/types/auth/auth";

const loginURL = process.env.NEXT_PUBLIC_LOGIN_URL;
const registerURL = process.env.NEXT_PUBLIC_REGISTER_URL;

if (!loginURL || !registerURL) throw new Error("invalid URL");

const defaultErrorMessage = "Error de conexión con el servidor";

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post<usuario>(loginURL, {email, password});
        const data = response.data;

        if (data) {
            return data;
        } else {
            throw new Error(defaultErrorMessage);
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return `${defaultErrorMessage}: ${error.message}`;
        }
        return defaultErrorMessage;
    }
};

export const register = async (clinica_name:string, telefono:string, email:string, password:string, rol:string ):Promise<clinica> => {
    try {
        const response = await axios.post<clinica>(registerURL, {clinica_name, telefono, email, password, rol});
        return response.data;
    } catch (error) {
        throw new Error(defaultErrorMessage + error);

    }
}