import { apiUrl } from '../common/constans';
import { RootState } from '../Store/store';
import { CustomError } from '../interfaces/errors/CustomError';
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
			const state = getState() as RootState;
			if (state.auth) {
				const {token} = state.auth.user;
				if (token) {
					headers.set('Authorization', token);
				}
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
	tagTypes: [
		'Items',
		'ItemsPrices',
		'Suppliers',
		'Supplies',
		'Storages',
		'Sources',
		'Categories',
		'Subcategories',
		'UnderSubcategories',
		'Countries',
		'Cities',
		'Bouquets',
		'BouquetsImage',
		'Recipes',
		'AvailableBouquets',
		'Orders',
		'Order',
		'InvoiceByNumber',
	],
});
