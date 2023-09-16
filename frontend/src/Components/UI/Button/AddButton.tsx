import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

interface Props {
	onClick: () => void;
	buttonText: string;
}

const AddButton = ({ onClick, buttonText }: Props) => {
	return (
		<Button
			variant="text"
			startIcon={<AddIcon />}
			color="success"
			onClick={onClick}
		>
			{buttonText}
		</Button>
	);
};

export default AddButton;
