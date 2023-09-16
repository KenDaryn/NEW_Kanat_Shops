import { Snackbar, Alert } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    message: ReactNode
}

const SuccessPopup = ({ open, onClose, message }: Props) => {
  return (
    <Snackbar 
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
    open={open} autoHideDuration={3000} onClose={onClose} color="success" >
      <Alert  onClose={onClose} severity="success">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessPopup;
