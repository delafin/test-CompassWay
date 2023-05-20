import { GetServerSideProps, type NextPage } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '~/server/auth';

import { columns } from '~ui/data-table/columns';
import { payments } from '~ui/data-table/data';
import { DataTable } from '~ui/data-table/data-table-pagination';

type THistory = {
	children?: React.ReactNode;
};

const history: NextPage<THistory> = ({}) => {
	return <DataTable columns={columns} data={payments} />;
};

export default history;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getServerSession(context.req, context.res, authOptions);
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}

	return {
		props: { session }
	};
};
