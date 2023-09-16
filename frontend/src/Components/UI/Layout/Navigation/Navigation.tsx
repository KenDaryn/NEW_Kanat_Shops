import { useLogoutMutation } from '../../../../Store/services/auth';
import {
	List,
	ListItem,
	ListItemButton,
	Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Logout } from '@mui/icons-material';

const Navigation = () => {
	const [logout] = useLogoutMutation();

	const logoutHandler = async () => {
		await logout();
	};

	return (
		<div>
			<List>
				<ListItem>
					<ListItemButton>
						<Logout />
						<Typography onClick={logoutHandler} component={Link} to={'/'}>
							Выйти
						</Typography>
					</ListItemButton>
				</ListItem>
			</List>
		</div>
	);
};

export default Navigation;
