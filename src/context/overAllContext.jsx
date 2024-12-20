import React, { createContext, useContext, useState } from 'react'
import Alert from '../utils/Alert';

const overAllContext = createContext();
const useOverAllContext = () => useContext(overAllContext);
function OverAllContextProvider({ children }) {
    const [success, setSuccess] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [errorInfo, setErrorInfo] = useState('');
    const [userRole, setUserRole] = useState(JSON.parse(localStorage.getItem('role')));
    return (
        <overAllContext.Provider value={{
            userRole,
            setUserRole,
            setSuccess,
            setOpenErrorAlert,
            setErrorInfo
        }}>
            {success ? (
                <Alert
                    open={openErrorAlert}
                    handleClose={() => setOpenErrorAlert(false)}
                    type="success"
                    message={errorInfo}
                />
            ) : (
                <Alert
                    open={openErrorAlert}
                    handleClose={() => setOpenErrorAlert(false)}
                    type="error"
                    message={errorInfo}
                />
            )}
            {children}
        </overAllContext.Provider>
    )
}
export { OverAllContextProvider, useOverAllContext };