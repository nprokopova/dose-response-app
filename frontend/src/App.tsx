import { AppBar, Toolbar, Typography } from '@mui/material';

import brandmark from './brandmark.svg';
import { PlotViewer } from './components/PlotViewer';

export default function Home() {
    return (
        <div className="root">
            <AppBar position="static" color="default">
                <Toolbar>
                    <div className="brandmarkContainer">
                        <img width={60} src={brandmark} alt="" />
                    </div>
                    <div className="pageTitle" style={{ marginLeft: '1rem' }}>
                        <Typography variant="h6" color="inherit">
                            Dose Response App
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>
            <PlotViewer />
        </div>
    );
}
