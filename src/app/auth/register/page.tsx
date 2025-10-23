'use client';
import {Box, Container, Typography, TextField, Button} from "@mui/material";
import Image from "next/image";
import {useState} from "react";
import {register} from "@/lib/auth/auth";
import Link from "next/link";

export default function LoginPage() {
    const [clinica_name, setClinicaName] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const rol = "admin";
    const [message, setMessage] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await register(clinica_name, telefono, email, password, rol);
            if (response) {
                console.log(response);
            } else {
                setMessage("Error al iniciar sesión. Verifique correo y contraseña.");
            }
        } catch (E) {
            setMessage("Error al iniciar sesión. Verifique correo y contraseña." + E);
        }
    };

    return (
        <Box sx={{display: "flex", height: "100vh", width: "100%",}}>

            <Container maxWidth={false} sx={{
                flex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>

                <Image src="/branding/LogoBackRec.png" alt="Logo Dentaris" className="w-120 -mt-4" />

                <Box className="text-center mb-3 -mt-15">
                    <Typography variant="h4" className="font-semibold text-gray-800">Bienvenido de Nuevo</Typography>
                    <Typography variant="h6" className="text-gray-600 mt-5">Por favor, inicia sesión para
                        continuar</Typography>
                </Box>

                <form onSubmit={handleRegister} className="lg:px-10 sm:px-4 md:px-4">
                    <TextField margin="normal" required fullWidth label="Ingresa el Nombre de tu Clínica" type="text" value={clinica_name}
                               onChange={(e) => setClinicaName(e.target.value)}/>

                    <TextField margin="normal" required fullWidth label="Ingresa tu número teléfonico" type="text" value={telefono}
                               onChange={(e) => setTelefono(e.target.value)}/>

                    <TextField margin="normal" required fullWidth label="Correo Electrónico" type="email" value={email}
                               onChange={(e) => setEmail(e.target.value)}/>

                    <TextField margin="normal" required fullWidth label="Contraseña" type="password" value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    <Typography variant="caption" className="text-gray-500">Debe ser de al menos 8 caracteres</Typography>

                    <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                        Crear Cuenta
                    </Button>

                    {message && (
                        <Typography color="error" sx={{mt: 1, textAlign: "center"}}>
                            {message}
                        </Typography>
                    )}
                </form>

                <Box className="w-full border-t border-gray-300 my-3" />
                <Typography>¿Ya tienes Cuenta? <Link href="login"> <span style={{color:"blue"}}>Inicia Sesión</span> </Link> </Typography>
            </Container>

            <Box
                sx={{
                    flex: 2,
                    position: "relative",
                    display: {xs: "none", md: "block"},
                }}>
                <Image src="/authImages/login.jpg" alt="Imagen de Login" fill style={{objectFit: "cover"}}/>
            </Box>

        </Box>
    );
}
