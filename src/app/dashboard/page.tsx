'use client'
import * as React from 'react';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import {Box, Typography} from '@mui/material';
import dayjs from 'dayjs';

export default function Home() {
    return (
        <Box className="grid">
            <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        value={dayjs()}
                        showDaysOutsideCurrentMonth
                        fixedWeekNumber={6}
                    />
                </LocalizationProvider>
                <Typography variant="h5" sx={{ fontWeight: 600, my: 3, textAlign: 'center' }}>
                    Fecha de Hoy
                </Typography>
            </Box>

            <Box>
            </Box>

        </Box>
    );
}
