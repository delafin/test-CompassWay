import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { env } from '~/env.mjs';

type TFetchedData = {
	// id: string;
	sender: number;
	recipient: string;
	subject: string;
	message: string;
};
type TSearchParams = { search?: string; ordering?: string; limit?: string; offset?: string };

// declare module '@reduxjs/toolkit/query/react' {
// 	interface FetchBaseQueryError {
// 		error: string
// 	}
// }

export const compassWayApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://68.183.74.14:4005/api/',
		prepareHeaders: (headers) => {
			headers.set('Authorization', 'Basic aWZpbmhpbWU6QVp2WUU0SEo=');
			headers.set('Accept', 'application/json'), headers.set('Content-Type', 'application/json');
		}
	}),
	tagTypes: ['emailInfo'],
	endpoints: (builder) => ({
		getAllEmails: builder.query<TFetchedData[], TSearchParams>({
			query: ({ search, ordering, limit, offset }) => ({
				url: `emails/`,
				method: 'GET',
				params: {
					search: search ? search : null,
					ordering: ordering ? ordering : null,
					limit: limit ? limit : null,
					offset: offset ? offset : null
				}
			}),
			providesTags: ['emailInfo']
		}),
		getSenderEmail: builder.query<TFetchedData[], number>({
			query: (senderId: number) => `emails/${senderId}/`,
			providesTags: ['emailInfo']
		}),
		createEmail: builder.mutation<TFetchedData[], TFetchedData>({
			query: (variableArg: TFetchedData) => ({
				url: 'emails/',
				method: 'POST',
				body: variableArg
			}),
			invalidatesTags: ['emailInfo']
		})
		// syncUsers: builder.mutation<TFetchedData[], TFetchedData>({
		// 	query: (variableArg: TFetchedData) => ({
		// 		url: '',
		// 		method: 'POST',
		// 		body: variableArg
		// 	}),
		// 	invalidatesTags: ['emailInfo']
		// })
	})
});
export const {
	useGetAllEmailsQuery,
	useLazyGetAllEmailsQuery,
	useGetSenderEmailQuery,
	useLazyGetSenderEmailQuery,
	useCreateEmailMutation
} = compassWayApi;

// SSR
export const {
	util: { getRunningQueriesThunk }
} = compassWayApi; // waite untill all tasks are done
export const { getSenderEmail } = compassWayApi.endpoints;
