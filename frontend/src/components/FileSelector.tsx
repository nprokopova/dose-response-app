import { useState } from 'react';

import { Button, Box, TextField, Typography } from '@mui/material';

export const FileSelector = ({
    onUpload,
}: {
    onUpload: (file: File) => Promise<void>;
}) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setFile(file);
    };

    return (
        <Box sx={{ margin: 'auto' }}>
            <Typography>
                Please select a csv file and press "Upload" to generate your
                plot.
            </Typography>
            <Box
                sx={{
                    margin: 'auto',
                    paddingTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                <TextField
                    size="small"
                    type="file"
                    inputProps={{ type: 'file', accept: '.csv' }}
                    onChange={handleFileChange}
                />
                <Button
                    onClick={() => {
                        if (!file) {
                            return;
                        }
                        onUpload(file);
                    }}
                    disabled={!file}
                    variant="contained"
                >
                    Upload
                </Button>
            </Box>
        </Box>
    );
};
