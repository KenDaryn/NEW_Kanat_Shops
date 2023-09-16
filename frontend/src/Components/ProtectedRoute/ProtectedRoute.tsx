import { Navigate } from 'react-router-dom';
import { ReactElement } from 'react';

interface Props {
	isAllowed: boolean;
	redirectPath: string;
	children: ReactElement;
}

const ProtectedRoute = ({ isAllowed, redirectPath, children }: Props) => {
	if (!isAllowed) {
		return <Navigate to={redirectPath} replace />;
	}
	return children;
};

export default ProtectedRoute;
