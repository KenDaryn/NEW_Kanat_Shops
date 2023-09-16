import { Alert, Snackbar } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    message: ReactNode;
}

const ErrorPopup = ({message, onClose, open}: Props) => {
    return (
        <Snackbar
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					open={open}
					autoHideDuration={3000}
					onClose={onClose}
				>
					<Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
						{message}
					</Alert>
				</Snackbar>
    );
};

export default ErrorPopup;