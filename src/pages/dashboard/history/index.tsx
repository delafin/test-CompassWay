import { GetServerSideProps, type NextPage } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '~/server/auth';

type THistory = {
	children?: React.ReactNode;
};

const history: NextPage<THistory> = ({}) => {
	return <div className=''>History</div>;
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
