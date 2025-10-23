'use client';
import {Box, Container, Typography, TextField, Button} from "@mui/material";
import Image from "next/image";
import {useState} from "react";
import {login} from "@/lib/auth/auth";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            if (response) {
                console.log(response);
            } else {
                setMessage("Error al iniciar sesión. Verifique correo y contraseña.");
            }
        } catch (error) {
            setMessage("Error al iniciar sesión. Verifique correo y contraseña." + error);
        }
    };

    return (
        <Box sx={{display: "flex", height: "100vh", width: "100%",}}>
            <Box
                sx={{
                    flex: 2,
                    position: "relative",
                    display: {xs: "none", md: "block"},
                }}>
                <Image src="/authImages/login.jpg" alt="Imagen de Login" fill style={{objectFit: "cover"}}/>
            </Box>

            <Container maxWidth={false} sx={{
                flex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>

                <Image src="/branding/LogoBackRec.png" alt="Logo Dentaris" className="w-120 -mt-4" />

                <Box className="text-center mb-6">
                    <Typography variant="h4" className="font-semibold text-gray-800">Bienvenido de Nuevo</Typography>
                    <Typography variant="h6" className="text-gray-600 mt-5">Por favor, inicia sesión para
                        continuar</Typography>
                </Box>

                <form onSubmit={handleLogin} className="lg:px-10 sm:px-4 md:px-4">
                    <TextField margin="normal" required fullWidth label="Correo Electrónico" type="email" value={email}
                               onChange={(e) => setEmail(e.target.value)}/>

                    <TextField margin="normal" required fullWidth label="Contraseña" type="password" value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    <Typography variant="caption" className="text-gray-500">Debe ser de al menos 8 caracteres</Typography>

                    <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                        Iniciar Sesión
                    </Button>

                    {message && (
                        <Typography color="error" sx={{mt: 1, textAlign: "center"}}>
                            {message}
                        </Typography>
                    )}
                </form>

                <Box className="w-full border-t border-gray-300 my-6" />
                <Typography>¿No tienes Cuenta? <Link href="register"> <span style={{color:"blue"}}>Crea una</span> </Link> </Typography>
            </Container>


        </Box>
    );
}
