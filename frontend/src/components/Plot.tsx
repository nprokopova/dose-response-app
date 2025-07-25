import { Alert, Box } from '@mui/material';
import { Scatter } from 'react-chartjs-2';
import {
    Chart,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    ChartOptions,
    Title,
    SubTitle,
} from 'chart.js';

import type { Point, FitResult } from '../types/Plot';

Chart.register(
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title,
    SubTitle
);

export const Plot = ({
    fitResult,
    onChange,
}: {
    fitResult: FitResult;
    onChange: (points: Point[]) => Promise<void>;
}) => {
    const { points, slope, intercept } = fitResult;

    const regressionLine = points.map(({ x }) => ({
        x,
        y: slope * x + intercept,
    }));

    const EC50log = (50 - intercept) / slope;
    const EC50 = Math.exp(EC50log);

    const data = {
        datasets: [
            {
                label: 'Data',
                data: points,
                backgroundColor: 'blue',
                showLine: false,
            },
            {
                label: 'Linear Regression (logX)',
                data: regressionLine,
                borderColor: 'red',
                borderWidth: 2,
                showLine: true,
                pointRadius: 0,
            },
        ],
    };

    const options: ChartOptions<'scatter'> = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Dose-Response Curve',
                align: 'center',
                position: 'top',
                font: {
                    size: 16,
                },
                padding: 20,
            },
            subtitle: {
                display: true,
                text: `EC50 ≈ ${EC50.toExponential(2)}`,
                font: {
                    size: 14,
                },
                align: 'start',
                color: 'black',
                padding: {
                    bottom: 20,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Drug Concentration (log)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Tumour cell killing (%)',
                },
            },
        },
        onClick: (event, _elements, chart) => {
            const xLoc = event.x;
            const yLoc = event.y;
            if (!xLoc || !yLoc) {
                return;
            }
            const xScale = chart.scales.x;
            const yScale = chart.scales.y;

            const xLocVal = xScale.getValueForPixel(xLoc);
            const yLocVal = yScale.getValueForPixel(yLoc);

            if (!xLocVal || !yLocVal) {
                return;
            }
            const threshold = 0.4;

            const idx = points.findIndex(({ x, y }) => {
                return (
                    Math.abs(x - xLocVal) < threshold &&
                    Math.abs(y - yLocVal) < threshold
                );
            });
            // remove point
            if (idx !== -1) {
                onChange(points.filter((_, i) => i !== idx));
                return;
            }
            // add point
            onChange([...points, { x: xLocVal, y: yLocVal }]);
        },
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Scatter data={data} options={options} />
            <Alert severity="info">
                This plot in interactive. Click on an existing data point to
                remove it, or click anywhere else to add a new point.
            </Alert>
        </Box>
    );
};
