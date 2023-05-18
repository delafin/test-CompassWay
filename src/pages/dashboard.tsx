import { GetServerSideProps, type NextPage } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '~/server/auth';

import List from '~ui/list/list';

type TProps = {
	children?: React.ReactNode;
};

const dashboard: NextPage<TProps> = ({}) => {
	return <List />;
};

export default dashboard;

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
