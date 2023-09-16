import { UserState } from './user/userTypes';

export type RootState = {
	readonly user: UserState;
};
