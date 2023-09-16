/* eslint-disable no-empty-pattern */
import authApi from '../Store/services/auth';
import { UserState } from '../Store/user/userTypes';
import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../interfaces/IUser';

const storedState = localStorage.getItem('authState');

const initialState: UserState = storedState ? JSON.parse(storedState) : {
	isAuthenticated: false,
	isLoading: false,
	user: {},
  };


export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addMatcher(authApi.endpoints.signIn.matchPending, (state, action) => {
				state.isAuthenticated = false;
				state.isLoading = true;
			})
			.addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, action) => {
				state.user = action.payload;
				state.isAuthenticated = true;
				state.isLoading = false;
				localStorage.setItem('authState', JSON.stringify(state));
			})
			.addMatcher(authApi.endpoints.signIn.matchRejected, (state, action) => {
				state.isAuthenticated = false;
				state.isLoading = false;
			})
			.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
				state.isAuthenticated = false;
				state.isLoading = false;
				state.user = {} as IUser;
				localStorage.removeItem('authState');
			});
	},
});

export const authActions = authSlice.actions;

export default authSlice.reducer;