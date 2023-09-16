import { IUser } from "../../interfaces/IUser";

export type UserRequest = {
	userName: string;
	password: string;
};

export type UserResponse = {
	id: number;
	username: string;
	password: string;
	email: string;
	phone: string;
	first_name: string;
	last_name: string;
	address: string;
	country: number;
	token: string;
};

export type UserState = {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: IUser;
};
