import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';

interface SelectOption {
	id: number;
	name: string;
}

interface SelectProps {
	value: string;
	label: string;
	name: string;
	onChange: (value: string) => void;
	options: SelectOption[];
}

const BasicSelect: React.FC<SelectProps> = ({
	value,
	label,
	name,
	onChange,
	options,
}) => {
	const handleChange = (event: SelectChangeEvent) => {
		onChange(event.target.value);
	};

	return (
		<Box
			sx={{
				minWidth: 120,
				marginTop: '10px',
				marginBottom: '10px',
				color: 'white',
			}}
		>
			<FormControl fullWidth>
				<InputLabel id={`select-label-${name}`}>{label}</InputLabel>
				<Select
					labelId={`select-label-${name}`}
					id={`select-${name}`}
					value={value}
					label={label}
					onChange={handleChange}
				>
					{options.map((option) => (
						<MenuItem key={option.id} value={option.id}>
							{option.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
};

export default BasicSelect;
