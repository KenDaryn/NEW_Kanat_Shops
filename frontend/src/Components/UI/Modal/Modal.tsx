import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	CircularProgress,
} from '@mui/material';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children?: React.ReactNode;
	isLoading: boolean;
	actionButtonLabel: string;
	onActionButtonClick: () => void;
}

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	isLoading,
	actionButtonLabel,
	onActionButtonClick,
}: Props) => {
	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle color='black'>{title}</DialogTitle>
			<DialogContent>{children}</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={isLoading}>
					Отмена
				</Button>
				<Button
					onClick={onActionButtonClick}
					disabled={isLoading}
					color="error"
				>
					{isLoading ? <CircularProgress size={20} /> : actionButtonLabel}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default Modal;
