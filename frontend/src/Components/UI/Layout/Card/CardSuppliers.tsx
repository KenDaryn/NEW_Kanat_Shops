import React, { MouseEventHandler } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface IProps {
	id: number;
	name_supplier: string;
	contact_person: string;
	email: string;
	phone: string;
	address: string;
	id_country: string;
	id_city: string;
	onClick: MouseEventHandler<HTMLButtonElement>;
	onClickDelete: MouseEventHandler<HTMLButtonElement>;
	create_date: Date;
}
interface ExpandMoreProps extends IconButtonProps {
	expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}));

const CardSuppliers = ({
	id,
	name_supplier,
	contact_person,
	email,
	phone,
	address,
	id_country,
	id_city,
	create_date,
	onClick,
	onClickDelete,
}: IProps) => {
	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const date = new Date(create_date);
	const formattedDate = date.toLocaleDateString();

	return (
		<Card key={id} sx={{ maxWidth: 500, m: '25px' }}>
			<CardHeader
				key={id}
				sx={{ height: '80px' }}
				action={[
					<IconButton onClick={onClickDelete} aria-label="settings">
						<DeleteForeverIcon />
					</IconButton>,
					<IconButton onClick={onClick} aria-label="settings">
						<EditIcon />
					</IconButton>,
					<ExpandMore
						expand={expanded}
						onClick={handleExpandClick}
						aria-expanded={expanded}
						aria-label="show more"
					>
						<ExpandMoreIcon />
					</ExpandMore>,
				]}
				title={name_supplier}
				subheader={phone}
			/>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					<Typography paragraph>{contact_person}</Typography>
					<Typography paragraph>{email}</Typography>
					<Typography paragraph>{address}</Typography>
					<Typography paragraph>{id_country}</Typography>
					<Typography paragraph>{id_city}</Typography>
					<Typography paragraph>{formattedDate}</Typography>
				</CardContent>
			</Collapse>
		</Card>
	);
};

export default CardSuppliers;
