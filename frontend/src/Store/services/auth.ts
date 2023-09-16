import { api } from '../../features';
import { UserForm } from '../../interfaces/RegisterForm';
import { loginForm } from '../../interfaces/loginForm';
import { UserResponse } from '../user/userTypes';

const authApi = api.injectEndpoints({
	endpoints: (build) => ({
		signUp: build.mutation<UserResponse, UserForm>({
			query: (body) => ({
				url: '/users',
				method: 'post',
				body,
			}),
		}),
		signIn: build.mutation<UserResponse, loginForm>({
			query: (body) => ({
				url: 'users/login',
				method: 'post',
				body,
			}),
		}),
		logout: build.mutation<void, void>({
			query: () => ({
				url: 'users/logout',
				method: 'delete',
			}),
		}),
	}),
});

export const { useSignUpMutation, useSignInMutation, useLogoutMutation } =
	authApi;

export default authApi;
