import { GetServerSideProps, GetServerSidePropsContext, type NextPage } from 'next';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '~/server/auth';
import {
	getRunningQueriesThunk,
	getSenderEmail,
	useGetAllEmailsQuery,
	useGetSenderEmailQuery
} from '~store/compass-way/email-handler';
import { AppStore, wrapper } from '~store/store';

import { columns } from '~ui/data-table/columns';
import { payments } from '~ui/data-table/data';
import { DataTable } from '~ui/data-table/data-table-pagination';

type THistory = {
	user: User;
};
const history: NextPage<THistory> = ({ user }) => {
	const { data: emails = [], isFetching, isLoading, isSuccess, isError, error } = useGetSenderEmailQuery(557);
	// const {
	// 	data: emails = [],
	// 	isFetching,
	// 	isLoading,
	// 	isSuccess,
	// 	isError,
	// 	error
	// } = useGetAllEmailsQuery({ search: '1' });

	console.log(error);
	console.log(emails);

	return <DataTable columns={columns} data={payments} />;
};

export default history;

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
