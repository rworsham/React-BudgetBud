import React, {useState, useEffect} from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function AlertHandler({ alertMessage }) {
    const [openAlert, setOpenAlert] = useState(false);
    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    useEffect(() => {
        if (alertMessage) {
            setOpenAlert(true);
        }
    }, [alertMessage]);

    return (
            <Snackbar open={openAlert}
                      autoHideDuration={6000}
                      onClose={handleAlertClose}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}>
                <Alert
                    onClose={handleAlertClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
    );
}