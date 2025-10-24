'use client'
import React from 'react';
import {useState} from "react";
import {Card} from '@mui/material';


import {cita, } from "@/types/citas/cita";

interface cardProps {
    cita:cita
}



const CardCita: React.FC<cardProps> = () => {

    const [open, setOpen] = useState(false);


    const handleOpen =() => setOpen(!open);


    return(
        <>
            <Card className='flex flex-col border-2 rounded-2xl drop-shadow-2xl p-2 bg-white' sx={{transition:'transform 0.2s ease, box-shadow 0.2s ease', cursor:'pointer', '&hover':{ transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',}}} onClick={handleOpen}>


            </Card>
        </>

    );
}

export default CardCita;
