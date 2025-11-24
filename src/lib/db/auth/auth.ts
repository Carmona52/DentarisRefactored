'use server'
import axios from "axios";
import {cookies} from 'next/headers'
import {clinica} from "@/types/auth/auth";
// import {jwtVerify, SignJWT} from "jose";

const loginURL = process.env.NEXT_PUBLIC_LOGIN_URL;
const registerURL = process.env.NEXT_PUBLIC_REGISTER_URL;
const passwordEncrypt = process.env.PASSWORD_ENCRYPT;

if (!loginURL || !registerURL) throw new Error("invalid URL");
if (!passwordEncrypt) throw new Error("invalid password");

const defaultErrorMessage = "Error de conexión con el servidor";

// const key = new TextEncoder().encode(passwordEncrypt);
//
// export async function encrypt(payload: any) {
//     return await new SignJWT(payload).setProtectedHeader({
//         alg: 'HS256',
//         typ: 'JWT'
//     }).setIssuedAt().setExpirationTime('24h').sign(key);
// }
//
// export async function decrypt(input: string):Promise<any> {
// const {payload} = await jwtVerify(input, key, {
//   algorithms: ['HS256'],
// });
//
// return payload;
// }
export const login = async (email: string, password: string) => {
    const cookieStore = await cookies();
    try {
        const response = await axios.post(loginURL, {email, password});
        const data = response.data;
        const consultorioData = data?.consultorio;
        const tokenUser: string = data?.token || "Token";

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

export const logOut = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_name");
}