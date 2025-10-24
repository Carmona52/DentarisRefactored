'use server'
import axios from "axios";
import { cookies } from 'next/headers'
import {usuario, clinica} from "@/types/auth/auth";

const loginURL = process.env.NEXT_PUBLIC_LOGIN_URL;
const registerURL = process.env.NEXT_PUBLIC_REGISTER_URL;

if (!loginURL || !registerURL) throw new Error("invalid URL");

const defaultErrorMessage = "Error de conexión con el servidor";

export const login = async (email: string, password: string)=> {
    const cookieStore = await cookies();

    try {
        const response = await axios.post(loginURL, {email, password});
        const data = response.data;
        const userData= data?.usuario;
        const consultorioData= data?.consultorio;
        const tokenUser:string = data?.token || "Token";


        if (response.status === 200 && tokenUser) {
            cookieStore.set({
                name: "auth_token",
                value: tokenUser,
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });

            if (consultorioData?.nombre) {
                cookieStore.set({
                    name: "user_name",
                    value: consultorioData.nombre,
                    path: "/",
                });
            }

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


export const register = async (clinica: string, telefono: string, email: string, password: string, rol: string): Promise<clinica> => {
    try {
        const response = await axios.post<clinica>(registerURL, {clinica, telefono, email, password, rol});
        return response.data;
    } catch (error) {
        throw new Error(defaultErrorMessage + error);

    }
}