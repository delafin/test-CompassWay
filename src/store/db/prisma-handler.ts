import { Message, User } from '@prisma/client';
import { createApi } from '@reduxjs/toolkit/query/react';
import { PartialSelect } from '~/types/global';
import { axiosBaseQuery } from '~lib/utils/base-query';

type MessageRespoce = Message & { senderEmail: string };
type MessageBasicRespoce = Message & { user: { email: string } };

export const dbApi = createApi({
	reducerPath: 'api',
	baseQuery: axiosBaseQuery({
		baseUrl: '/api/db/',
		baseHeaders: {
			'Content-Type': 'application/json'
		}
	}),

	tagTypes: ['db', 'user'],
	endpoints: (builder) => ({
		getAllMessages: builder.query<
			MessageRespoce[],
			{ userId: string; skip: number | null; take: number | null }
		>({
			query: ({ userId, skip, take }) => ({
				url: `${userId}/get-messages`,
				method: 'GET',
				params: {
					skip: skip || skip === 0 ? skip : null,
					take: take ? take : null
				}
			}),
			transformResponse: (response: MessageBasicRespoce[]) => {
				return response.map(({ user, ...rest }, i) => {
					return { ...rest, senderEmail: user.email };
				});
			},
			providesTags: ['db']
		}),
		pushNewMessage: builder.mutation<
			Message,
			PartialSelect<Message, 'id' | 'createdAt' | 'updatedAt' | 'sender' | 'senderEmail'>
		>({
			query: (message) => ({
				url: `create-message`,
				method: 'POST',
				data: message
			}),
			invalidatesTags: ['db']
		}),
		pushNewUser: builder.mutation<User, PartialSelect<User, 'id' | 'image' | 'emailVerified' | 'sender'>>({
			query: (user) => ({
				url: `create-user`,
				method: 'POST',
				data: user
			}),
			invalidatesTags: ['user']
		})
	})
});
export const {
	useGetAllMessagesQuery,
	useLazyGetAllMessagesQuery,

	usePushNewMessageMutation,
	usePushNewUserMutation
} = dbApi;

// SSR
export const {
	util: { getRunningQueriesThunk }
} = dbApi; // waite untill all tasks are done
export const { getAllMessages } = dbApi.endpoints;
