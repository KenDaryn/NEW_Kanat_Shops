import { TextField, Grid } from '@mui/material';
import React, {
	ChangeEventHandler,
	HTMLInputTypeAttribute,
	ReactNode,
} from 'react';

interface Props {
	value: string;
	label: string;
	name: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	type?: HTMLInputTypeAttribute | 'select';
	required?: boolean;
	error?: string;
	id?: string;
	children?: ReactNode;
}

const FormElement = ({
	name,
	label,
	value,
	onChange,
	type = 'text',
	required = false,
	error,
	id,
	children,
}: Props) => {
	return (
		<Grid item xs={12} sx={{ color: 'secondary', my: 2 }}>
			<TextField
				id={id}
				type={type}
				required={required}
				value={value}
				onChange={onChange}
				name={name}
				variant="outlined"
				fullWidth
				label={label}
				error={!!error}
				helperText={error}
			/>
			{children}
		</Grid>
	);
};

export default FormElement;
