import { useState, useEffect } from 'react';

import { Box, Alert } from '@mui/material';

import { FileSelector } from './FileSelector';
import { Plot } from './Plot';
import type { FitResult, Point } from '../types/Plot';

export const PlotViewer = () => {
    const [fitResult, setFitResult] = useState<FitResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('fitResult');
        if (saved) {
            setFitResult(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (fitResult) {
            localStorage.setItem('fitResult', JSON.stringify(fitResult));
        }
    }, [fitResult]);

    const uploadFile = async (file: File) => {
        setError(null);
        setFitResult(null);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                setError(
                    `Failed to generate chart due to HTTP Error (Status: ${response.status})`
                );
                return;
            }
            const data = await response.json();
            setFitResult(data);
        } catch (err) {
            setError(
                `Failed to generate chart: ${
                    err instanceof Error ? err.message : 'Unknown error'
                }`
            );
        }
    };

    const regress = async (points: Point[]) => {
        setError(null);
        try {
            const response = await fetch('/regress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ points }),
            });
            if (!response.ok) {
                setError(
                    `Failed to update chart due to HTTP Error (Status: ${response.status})`
                );
                return;
            }
            const data = await response.json();
            setFitResult(data);
        } catch (err) {
            setError(
                `Failed to update chart: ${
                    err instanceof Error ? err.message : 'Unknown error'
                }`
            );
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3rem',
                margin: '4rem',
            }}
        >
            <FileSelector onUpload={uploadFile} />
            {error && <Alert severity="error">{error}</Alert>}
            {fitResult && <Plot fitResult={fitResult} onChange={regress} />}
        </Box>
    );
};
