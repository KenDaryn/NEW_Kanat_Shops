import { MouseEventHandler } from 'react';
import {
	Card,
	CardHeader,
	CardActions,
	Button,
	CardContent,
	Typography,
} from '@mui/material';
import { Edit, DeleteForever } from '@mui/icons-material';

interface IProps {
	id: number;
	name: string;
	onClick: MouseEventHandler<HTMLButtonElement>;
	onClickDelete: MouseEventHandler<HTMLButtonElement>;
	description: string;
	create_date: string;
	category_name: string;
	subcategory_name: string;
	under_subcategory_name: string;
}

const CardItems = ({
	id,
	name,
	description,
	category_name,
	subcategory_name,
	under_subcategory_name,
	onClick,
	onClickDelete,
}: IProps) => {
	return (
		<Card key={id} sx={{ width: 280, m: '10px' }}>
			<CardHeader
				sx={{ height: '120px' }}
				title={name}
				subheader={description}
			/>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					({category_name}, {subcategory_name}, {under_subcategory_name})
				</Typography>
			</CardContent>
			<CardActions>
				<Button
					variant="contained"
					startIcon={<DeleteForever />}
					color="error"
					onClick={onClickDelete}
					aria-label="settings"
				>
					Удалить
				</Button>
				<Button
					onClick={onClick}
					startIcon={<Edit />}
					variant="contained"
					color="secondary"
					aria-label="settings"
				>
					Изменить
				</Button>
			</CardActions>
		</Card>
	);
};

export default CardItems;
