import { IUser } from '../../../interfaces/IUser';
import * as React from 'react';
import {
	Box,
	Avatar,
	Menu,
	MenuItem,
	IconButton,
	Tooltip,
	ListItemIcon,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { deepPurple } from '@mui/material/colors';

interface Props {
	logout: () => Promise<void>;
	displayName: string;
	user: IUser;
}

const UserMenu = ({ logout, user, displayName }: Props) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const logoutHandler = async () => {
		handleClose();
		await logout();
	};

	return (
		<React.Fragment>
			<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
				<Tooltip title="Account settings">
					<IconButton
						onClick={handleClick}
						size="small"
						sx={{ ml: 2 }}
						aria-controls={open ? 'account-menu' : undefined}
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
					>
						<Avatar sx={{ width: 32, height: 32, bgcolor: deepPurple[500] }}>
							{user.username[0].toUpperCase()}
						</Avatar>
					</IconButton>
				</Tooltip>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={logoutHandler}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Выйти
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
};
export default UserMenu;
