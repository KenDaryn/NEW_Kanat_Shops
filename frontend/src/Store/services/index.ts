import { apiUrl } from '../../common/constans';
import { CustomError } from '../../interfaces/errors/CustomError';
import { UserState } from '../user/userTypes';
import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
	FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';

export const api = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: apiUrl,
		prepareHeaders: (headers, { getState }) => {
			const state = getState() as UserState;
			const {token} = state.user;

			if (token) {
				headers.set('Authorization', token);
			}
		},
	}) as BaseQueryFn<
		string | FetchArgs,
		unknown,
		FetchBaseQueryError | CustomError | { error: object },
		{},
		FetchBaseQueryMeta
	>,
	endpoints: () => ({}),
	tagTypes: ['Items', 'Suppliers'],
});
