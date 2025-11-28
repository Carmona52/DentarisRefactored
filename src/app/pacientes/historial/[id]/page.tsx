'use client'
import {useParams, useRouter} from 'next/navigation';
import {getHistorialMedicoById} from "@/lib/db/pacientes/getHistorialMedico";
import {getAntecedentes} from "@/lib/db/pacientes/getHistorialMedico";
import {historialClinico} from '@/types/historiales/historialClinico';
import {
    Button,
    Typography,
    Grid,
    Paper,
    Box,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from "@mui/material";
import {useEffect, useState, useRef} from "react"; // ✅ Añadido useRef aquí
import SimpleLoader from "@/components/loaders/SimpleLoader";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function HistorialMedicoFormalPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>()
    const id = Number(params.id)
    const [historialData, setHistorialData] = useState<historialClinico>();
    const [antecedentesData, setAntecedentesData] = useState<any>();
    const [loading, setLoading] = useState(true);
    const pdfRef = useRef<HTMLDivElement>(null);

    const getData = async () => {
        setLoading(true);
        try {
            const [historial, antecedentes] = await Promise.all([
                getHistorialMedicoById(id),
                getAntecedentes(id)
            ]);
            setHistorialData(historial);
            setAntecedentesData(antecedentes);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    const downloadPDF = async () => {
        if (!pdfRef.current) return;

        setLoading(true);
        try {
            const element = pdfRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`historial-clinico-${id}.pdf`);
        } catch (error) {
            console.error('Error al generar PDF:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatBoolean = (value: boolean) => value ? "Sí" : "No";
    const formatHabito = (habito: string) => {
        const habitoLower = habito.toLowerCase();
        if (habitoLower === 'no' || habitoLower === 'nunca') return 'No';
        if (habitoLower === 'si' || habitoLower === 'sí') return 'Sí';
        return habito.charAt(0).toUpperCase() + habito.slice(1);
    };

    if (loading) {
        return <SimpleLoader/>;
    }

    return (
        <Box sx={{p: 3}}>
            {/* Botones de acción */}
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2}}>
                <Button
                    variant="outlined"
                    onClick={() => router.back()}
                    sx={{borderColor: '#000', color: '#000'}}
                >
                    Regresar
                </Button>
                <Button
                    variant="contained"
                    onClick={downloadPDF}
                    color='primary'
                    disabled={loading}
                >
                    {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </Button>
            </Box>

            {/* Contenido para PDF */}
            <div ref={pdfRef}>
                <Box sx={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    backgroundColor: 'white',
                    fontFamily: 'Arial, sans-serif',
                    p: 3,
                    '@media print': {
                        p: 0,
                        margin: 0
                    }
                }}>

                    {/* ENCABEZADO */}
                    <Box sx={{textAlign: 'center', mb: 4, borderBottom: '2px solid #000', pb: 2}}>
                        <Typography variant="h4" component="h1"
                                    sx={{fontWeight: 'bold', letterSpacing: 2, fontSize: '28px'}}>
                            HISTORIA CLÍNICA
                        </Typography>
                        <Typography variant="h5" sx={{fontStyle: 'italic', mt: 1, fontSize: '20px'}}>
                            Odontología
                        </Typography>
                    </Box>

                    {historialData && (
                        <Box sx={{lineHeight: 1.8, fontSize: '14px'}}>

                            {/* DATOS GENERALES */}
                            <Paper elevation={1} sx={{p: 3, mb: 3, border: '1px solid #000'}}>
                                <Typography variant="h5" sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    textAlign: 'center',
                                    textDecoration: 'underline',
                                    fontSize: '18px'
                                }}>
                                    DATOS GENERALES
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid>
                                        <Typography><strong>ID Paciente:</strong> {historialData.paciente_id}
                                        </Typography>
                                    </Grid>
                                    <Grid >
                                        <Typography><strong>ID Dentista:</strong> {historialData.dentista_id}
                                        </Typography>
                                    </Grid>
                                    <Grid>
                                        <Typography><strong>Consultorio:</strong> {historialData.consultorio_id}
                                        </Typography>
                                    </Grid>
                                    <Grid >
                                        <Typography><strong>Folio:</strong> HC-{historialData.historial_id}</Typography>
                                    </Grid>
                                    <Grid >
                                        <Typography><strong>Fecha:</strong> {new Date(historialData.created_at).toLocaleDateString('es-MX')}
                                        </Typography>
                                    </Grid>
                                    <Grid >
                                        <Typography><strong>Cita ID:</strong> {historialData.cita_id}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* ANTECEDENTES FAMILIARES Y HEREDITARIOS */}
                            {antecedentesData && (
                                <Paper elevation={1} sx={{p: 3, mb: 3, border: '1px solid #000'}}>
                                    <Typography variant="h5" sx={{
                                        fontWeight: 'bold',
                                        mb: 3,
                                        textAlign: 'center',
                                        textDecoration: 'underline',
                                        fontSize: '18px'
                                    }}>
                                        ANTECEDENTES FAMILIARES Y HEREDITARIOS
                                    </Typography>

                                    <TableContainer>
                                        <Table sx={{border: '1px solid #000'}}>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell sx={{
                                                        border: '1px solid #000',
                                                        fontWeight: 'bold',
                                                        width: '30%'
                                                    }}>
                                                        Diabetes
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000', width: '70%'}}>
                                                        {formatBoolean(antecedentesData.heredofamiliares.diabetes)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Hipertensión Arterial
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {formatBoolean(antecedentesData.heredofamiliares.hipertension)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Cardiopatías
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {antecedentesData.heredofamiliares.cardiopatias ? formatBoolean(antecedentesData.heredofamiliares.cardiopatias) : 'No'}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Epilepsia
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {formatBoolean(antecedentesData.personales_patologicos.epilepsia)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Hepatitis
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {antecedentesData.personales_patologicos.hepatitis ? formatBoolean(antecedentesData.personales_patologicos.hepatitis) : 'No'}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Otros
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {antecedentesData.heredofamiliares.otros || 'Ninguno'}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            )}

                            {/* ANTECEDENTES PERSONALES PATOLÓGICOS */}
                            {antecedentesData && (
                                <Paper elevation={1} sx={{p: 3, mb: 3, border: '1px solid #000'}}>
                                    <Typography variant="h5" sx={{
                                        fontWeight: 'bold',
                                        mb: 3,
                                        textAlign: 'center',
                                        textDecoration: 'underline',
                                        fontSize: '18px'
                                    }}>
                                        ANTECEDENTES PERSONALES PATOLÓGICOS
                                    </Typography>

                                    <TableContainer>
                                        <Table sx={{border: '1px solid #000'}}>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell sx={{
                                                        border: '1px solid #000',
                                                        fontWeight: 'bold',
                                                        width: '25%'
                                                    }}>
                                                        Asma
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000', width: '25%'}}>
                                                        {formatBoolean(antecedentesData.personales_patologicos.asma)}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        border: '1px solid #000',
                                                        fontWeight: 'bold',
                                                        width: '25%'
                                                    }}>
                                                        Alergias
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000', width: '25%'}}>
                                                        {antecedentesData.alergias.penicilina || antecedentesData.alergias.nsaids ? 'Sí' : 'No'}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Epilepsia
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {formatBoolean(antecedentesData.personales_patologicos.epilepsia)}
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Penicilina
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {formatBoolean(antecedentesData.alergias.penicilina)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Diabetes
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {antecedentesData.personales_patologicos.diabetes ? formatBoolean(antecedentesData.personales_patologicos.diabetes) : 'No'}
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        AINEs
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {formatBoolean(antecedentesData.alergias.nsaids)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Hipertensión
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {antecedentesData.personales_patologicos.hipertension ? formatBoolean(antecedentesData.personales_patologicos.hipertension) : 'No'}
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Anestésicos
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {antecedentesData.alergias.anestesicos ? formatBoolean(antecedentesData.alergias.anestesicos) : 'No'}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Hepatitis
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {antecedentesData.personales_patologicos.hepatitis ? formatBoolean(antecedentesData.personales_patologicos.hepatitis) : 'No'}
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000', fontWeight: 'bold'}}>
                                                        Otros
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000'}}>
                                                        {antecedentesData.alergias.otros || 'Ninguno'}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* MEDICACIÓN ACTUAL */}
                                    {antecedentesData.medicacion_actual.length > 0 && (
                                        <Box sx={{mt: 3}}>
                                            <Typography variant="h6" sx={{fontWeight: 'bold', mb: 2, fontSize: '16px'}}>
                                                MEDICACIÓN ACTUAL:
                                            </Typography>
                                            {antecedentesData.medicacion_actual.map((med: any, index: number) => (
                                                <Typography key={index} variant="body2" sx={{ml: 2}}>
                                                    • {med.nombre} - {med.dosis} - {med.frecuencia}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}

                                    {/* ANTECEDENTES QUIRÚRGICOS */}
                                    {antecedentesData.quirurgicos.length > 0 && (
                                        <Box sx={{mt: 3}}>
                                            <Typography variant="h6" sx={{fontWeight: 'bold', mb: 2, fontSize: '16px'}}>
                                                INTERVENCIONES QUIRÚRGICAS:
                                            </Typography>
                                            {antecedentesData.quirurgicos.map((quirurgico: any, index: number) => (
                                                <Typography key={index} variant="body2" sx={{ml: 2}}>
                                                    • {quirurgico.procedimiento} ({quirurgico.año})
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}
                                </Paper>
                            )}

                            {/* ANTECEDENTES PERSONALES NO PATOLÓGICOS */}
                            {antecedentesData && (
                                <Paper elevation={1} sx={{p: 3, mb: 3, border: '1px solid #000'}}>
                                    <Typography variant="h5" sx={{
                                        fontWeight: 'bold',
                                        mb: 3,
                                        textAlign: 'center',
                                        textDecoration: 'underline',
                                        fontSize: '18px'
                                    }}>
                                        ANTECEDENTES PERSONALES NO PATOLÓGICOS
                                    </Typography>

                                    <TableContainer>
                                        <Table sx={{border: '1px solid #000'}}>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell sx={{
                                                        border: '1px solid #000',
                                                        fontWeight: 'bold',
                                                        width: '25%',
                                                        textAlign: 'center'
                                                    }}>
                                                        Alcohol
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        border: '1px solid #000',
                                                        width: '25%',
                                                        textAlign: 'center'
                                                    }}>
                                                        {formatHabito(antecedentesData.habitos.alcohol)}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        border: '1px solid #000',
                                                        fontWeight: 'bold',
                                                        width: '25%',
                                                        textAlign: 'center'
                                                    }}>
                                                        Tabaquismo
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        border: '1px solid #000',
                                                        width: '25%',
                                                        textAlign: 'center'
                                                    }}>
                                                        {formatHabito(antecedentesData.habitos.tabaquismo)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{
                                                        border: '1px solid #000',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center'
                                                    }}>
                                                        Drogas
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000', textAlign: 'center'}}>
                                                        {antecedentesData.habitos.drogas ? formatHabito(antecedentesData.habitos.drogas) : 'No'}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        border: '1px solid #000',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center'
                                                    }}>
                                                        Actividad Física
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000', textAlign: 'center'}}>
                                                        {antecedentesData.personales_no_patol.actividad_fisica}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{
                                                        border: '1px solid #000',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center'
                                                    }}>
                                                        Higiene Bucal
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000', textAlign: 'center'}}>
                                                        {antecedentesData.habitos.higiene_bucal || 'No especificado'}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        border: '1px solid #000',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center'
                                                    }}>
                                                        Otros
                                                    </TableCell>
                                                    <TableCell sx={{border: '1px solid #000', textAlign: 'center'}}>
                                                        {antecedentesData.personales_no_patol.dieta || 'Ninguno'}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            )}

                            {/* MOTIVO DE CONSULTA */}
                            <Paper elevation={1} sx={{p: 3, mb: 3, border: '1px solid #000'}}>
                                <Typography variant="h5" sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    textAlign: 'center',
                                    textDecoration: 'underline',
                                    fontSize: '18px'
                                }}>
                                    MOTIVO DE CONSULTA
                                </Typography>
                                <Box sx={{
                                    p: 2,
                                    border: '1px solid #666',
                                    minHeight: '80px',
                                    backgroundColor: '#f9f9f9'
                                }}>
                                    <Typography variant="body1" style={{whiteSpace: 'pre-line'}}>
                                        {historialData.motivo_consulta}
                                    </Typography>
                                </Box>
                            </Paper>

                            {/* DIAGNÓSTICO Y TRATAMIENTO */}
                            <Paper elevation={1} sx={{p: 3, mb: 3, border: '1px solid #000'}}>
                                <Typography variant="h5" sx={{
                                    fontWeight: 'bold',
                                    mb: 3,
                                    textAlign: 'center',
                                    textDecoration: 'underline',
                                    fontSize: '18px'
                                }}>
                                    DIAGNÓSTICO Y TRATAMIENTO
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid>
                                        <Typography variant="h6" sx={{fontWeight: 'bold', mb: 1, fontSize: '16px'}}>
                                            Diagnóstico Presuntivo:
                                        </Typography>
                                        <Box sx={{
                                            p: 2,
                                            border: '1px solid #666',
                                            minHeight: '60px',
                                            backgroundColor: '#f9f9f9'
                                        }}>
                                            <Typography>
                                                {historialData.diagnostico_presuntivo || "No especificado"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid>
                                        <Typography variant="h6" sx={{fontWeight: 'bold', mb: 1, fontSize: '16px'}}>
                                            Diagnóstico Definitivo:
                                        </Typography>
                                        <Box sx={{
                                            p: 2,
                                            border: '1px solid #666',
                                            minHeight: '60px',
                                            backgroundColor: '#f9f9f9'
                                        }}>
                                            <Typography>
                                                {historialData.diagnostico_definitivo || "Pendiente"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    {historialData.plan_resumen && (
                                        <Grid >
                                            <Typography variant="h6" sx={{fontWeight: 'bold', mb: 1, fontSize: '16px'}}>
                                                Plan de Tratamiento:
                                            </Typography>
                                            <Box sx={{
                                                p: 2,
                                                border: '1px solid #666',
                                                minHeight: '60px',
                                                backgroundColor: '#f9f9f9'
                                            }}>
                                                <Typography style={{whiteSpace: 'pre-line'}}>
                                                    {historialData.plan_resumen}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>

                            {/* ALERTAS CLÍNICAS */}
                            {antecedentesData?.alertas_clinicas?.length > 0 && (
                                <Paper elevation={1}
                                       sx={{p: 3, mb: 3, border: '2px solid #d32f2f', backgroundColor: '#ffebee'}}>
                                    <Typography variant="h5"
                                                sx={{fontWeight: 'bold', mb: 2, textAlign: 'center', color: '#d32f2f', fontSize: '18px'}}>
                                        ⚠ ALERTAS CLÍNICAS
                                    </Typography>
                                    <Box sx={{p: 2}}>
                                        {antecedentesData.alertas_clinicas.map((alerta: string, index: number) => (
                                            <Typography key={index} variant="body1"
                                                        sx={{color: '#d32f2f', fontWeight: 'bold'}}>
                                                • {alerta}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Paper>
                            )}

                            {/* FIRMA DEL PROFESIONAL */}
                            <Paper elevation={1} sx={{p: 3, border: '1px solid #000', backgroundColor: '#f8f9fa'}}>
                                <Typography variant="h5" sx={{
                                    fontWeight: 'bold',
                                    mb: 3,
                                    textAlign: 'center',
                                    textDecoration: 'underline',
                                    fontSize: '18px'
                                }}>
                                    FIRMA DEL PROFESIONAL
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid>
                                        <Typography variant="body1">
                                            <strong>Profesional Responsable:</strong> {historialData.firmado_por || "Por firmar"}
                                        </Typography>
                                    </Grid>
                                    <Grid >
                                        <Typography variant="body1">
                                            <strong>Fecha de Firma:</strong> {historialData.firmado_en ? new Date(historialData.firmado_en).toLocaleDateString('es-MX') : "Pendiente"}
                                        </Typography>
                                    </Grid>
                                    <Grid>
                                        <Typography variant="body2"
                                                    sx={{fontStyle: 'italic', mt: 2, textAlign: 'center'}}>
                                            Documento confidencial protegido por la Ley Federal de Protección de Datos Personales
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    )}
                </Box>
            </div>
        </Box>
    );
}