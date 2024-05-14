import React from 'react';
import { Snackbar, SnackbarContent, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';

const SnackBarContent = styled(SnackbarContent)(() => ({
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    color: '#000',
}));

const Message = styled('span')({
    display: 'flex',
    alignItems: 'center',
});

function Alert({ open, handleClose, type, message }) {
    return (
        <Snackbar autoHideDuration={1500} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <SnackBarContent
                type={type}
                message={(
                    <Message>
                        {type === 'success' ? (
                            <Typography
                                sx={{
                                    height: '30px',
                                    width: '30px',
                                    borderRadius: '30%',
                                    alignItems: 'center',
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    padding: '5px',
                                    color: 'rgb(27, 128, 106)',
                                    backgroundColor: 'rgba(54, 179, 126, 0.16)',
                                    marginRight: '16px',
                                }}
                            >
                                <CheckCircleIcon fontSize="small" />
                            </Typography>
                        )
                            : (
                                <Typography sx={{
                                    height: '30px',
                                    width: '30px',
                                    borderRadius: '30%',
                                    alignItems: 'center',
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    padding: '5px',
                                    color: 'rgb(183, 29, 24)',
                                    backgroundColor: 'rgba(255, 86, 48, 0.16)',
                                    marginRight: '16px',
                                }}
                                >
                                    <ErrorIcon fontSize="small" />
                                </Typography>
                            )}
                        {message}
                    </Message>
                )}
                action={[
                    <IconButton key="close" color="inherit" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        </Snackbar>
    );
}

export default Alert;
