import { useState } from 'react';

import { GetServerSideProps, GetServerSidePropsContext, type NextPage } from 'next';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '~/server/auth';
import { useGetAllMessagesQuery } from '~store/db/prisma-handler';
import { AppStore, wrapper } from '~store/store';

import { columns } from '~ui/data-table/columns';
import { DataTable } from '~ui/data-table/data-table-pagination';

type THistory = {
	user: User;
};
const History: NextPage<THistory> = ({ user }) => {
	const [take, setTake] = useState<number | null>(null);
	const [skip, setSkip] = useState<number | null>(0);
	const { data = [] } = useGetAllMessagesQuery({ userId: user.id, skip: skip, take: take });
	return (
		<DataTable
			columns={columns}
			data={data}
			userId={user.id}
			skip={skip}
			take={take}
			setSkip={setSkip}
			setTake={setTake}
		/>
	);
};

export default History;

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
	(store: AppStore) => async (context: GetServerSidePropsContext) => {
		const session = await getServerSession(context.req, context.res, authOptions);
		if (!session) {
			return {
				redirect: {
					destination: '/',
					permanent: false
				}
			};
		}
		// store.dispatch(getSenderEmail.initiate(session.user.sender));
		// await Promise.all(store.dispatch(getRunningQueriesThunk()));
		const { user } = session;
		return {
			props: { user }
		};
	}
);
