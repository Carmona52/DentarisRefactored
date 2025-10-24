'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, Typography, TextField, Button, CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { register } from "@/lib/db/auth/auth";

export default function RegisterPage() {
    const router = useRouter();

    const [clinicaName, setClinicaName] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const rol = "Administrador";

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!clinicaName || !telefono || !email || !password) {
            setError("Todos los campos son obligatorios.");
            return;
        }
        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        try {
            setLoading(true);
            const response = await register(clinicaName, telefono, email, password, rol);

            if (response?.success) {
                router.push("/dashboard");
            } else {
                setError("Error al crear la cuenta. Verifique los datos.");
            }
        } catch (err) {
            setError("Error en el servidor. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
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
                    alt="Logo Dentaris"
                    width={300}
                    height={100}
                    priority
                />

                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                        Crea tu cuenta
                    </Typography>
                    <Typography variant="h6" color="text.secondary" mt={2}>
                        Registra tu clínica para continuar
                    </Typography>
                </Box>

                <form onSubmit={handleRegister} style={{ width: "100%", maxWidth: 400 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Nombre de la Clínica"
                        value={clinicaName}
                        onChange={(e) => setClinicaName(e.target.value)}
                        autoComplete="organization"
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Número Telefónico"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        autoComplete="tel"
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Correo Electrónico"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        helperText="Debe ser de al menos 8 caracteres"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Crear Cuenta"}
                    </Button>

                    {error && (
                        <Typography color="error" textAlign="center" mt={1}>
                            {error}
                        </Typography>
                    )}
                </form>

                <Box sx={{ width: "100%", borderTop: "1px solid", borderColor: "divider", my: 4 }} />

                <Typography>
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/auth/login" style={{ color: "blue", textDecoration: "underline" }}>
                        Inicia Sesión
                    </Link>
                </Typography>
            </Container>

            <Box
                sx={{
                    flex: 2,
                    position: "relative",
                    display: { xs: "none", md: "block" },
                }}
            >
                <Image
                    src="/authImages/login.jpg"
                    alt="Imagen de registro"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                />
            </Box>
        </Box>
    );
}