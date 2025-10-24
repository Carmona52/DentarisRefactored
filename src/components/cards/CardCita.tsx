'use client'
import React from 'react';
import {useState} from "react";
import {Box, Card, Typography, Button, Modal, Backdrop, Fade, Divider,} from '@mui/material';
import {CalendarMonth as CalendarMonthIcon, AccessTime as AccessTimeIcon, Person as PersonIcon, Close as CloseIcon,} from '@mui/icons-material';
import {useRouter} from "next/navigation";

import {cita, updateCita} from "@/types/citas/cita";
import dayjs from "dayjs";

interface cardProps {
    cita:cita
}

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '50%',
    borderRadius: 4,
    boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const CardCita: React.FC<cardProps> = ({cita}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleOpen =() => setOpen(!open);
    const handleOpenModalUpdate = () => setModalIsOpen(!modalIsOpen);

    return(
        <>
            <Card className='flex flex-col border-2 rounded-2xl drop-shadow-2xl p-2 bg-white' sx={{transition:'transform 0.2s ease, box-shadow 0.2s ease', cursor:'pointer', '&hover':{ transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',}}} onClick={handleOpen}>


            </Card>
        </>

    );
}

export default CardCita;
