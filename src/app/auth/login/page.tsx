'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { login } from "@/lib/db/auth/auth";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Por favor, complete todos los campos.");
            return;
        }
        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        try {
            setLoading(true);
            const response = await login(email, password);
            console.log(response)

            if (response?.success) {
                router.push("/dashboard");
            } else {

                setError("Correo o contraseña incorrectos.");
            }
        } catch {
            setError("Error al iniciar sesión. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
            {/* Imagen lateral */}
            <Box
                sx={{
                    flex: 2,
                    position: "relative",
                    display: { xs: "none", md: "block" },
                }}
            >
                <Image
                    src="/authImages/login.jpg"
                    alt="Imagen de inicio de sesión"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                />
            </Box>

            {/* Formulario */}
            <Container
                maxWidth={false}
                sx={{
                    flex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    px: { xs: 2, md: 6 },
                }}
            >
                <Image
                    src="/branding/LogoBackRec.png"
                    width={300}
                    height={100}
                    alt="Logo Dentaris"
                    priority
                />

                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                        Bienvenido de Nuevo
                    </Typography>
                    <Typography variant="h6" color="text.secondary" mt={2}>
                        Por favor, inicia sesión para continuar
                    </Typography>
                </Box>

                <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: 400 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Correo Electrónico"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Correo electrónico"
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Contraseña"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        helperText="Debe ser de al menos 8 caracteres"
                        aria-label="Contraseña"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar Sesión"}
                    </Button>

                    {error && (
                        <Typography color="error" textAlign="center" mt={1}>
                            {error}
                        </Typography>
                    )}
                </form>

                <Box
                    sx={{
                        width: "100%",
                        borderTop: "1px solid",
                        borderColor: "divider",
                        my: 4,
                    }}
                />

                <Typography>
                    ¿No tienes cuenta?{" "}
                    <Link
                        href="/auth/register"
                        style={{ color: "blue", textDecoration: "underline" }}
                    >
                        Crea una
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
}