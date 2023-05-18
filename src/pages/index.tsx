import { type GetServerSideProps, type NextPage } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '~/server/auth';

import Modal from '~ui/sign-in/sign-in';

const Home: NextPage = () => {
	return (
		<>
			<Modal />
		</>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getServerSession(context.req, context.res, authOptions);
	if (session) {
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false
			},
			props: { session }
		};
	}
	return {
		props: {}
	};
};
