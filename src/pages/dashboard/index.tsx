import { GetServerSideProps, type NextPage } from 'next';
import { Session, User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';

import EmailForm from '~/common/components/email-form/email-form';
import { authOptions } from '~/server/auth';

type TDashboard = {
	user: User;
};

const dashboard: NextPage<TDashboard> = ({ user }) => {
	return <EmailForm userId={user.id} userEmail={user.email!} userSender={user.sender} />;
};

export default dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getServerSession(context.req, context.res, authOptions);
	// const session = await getSession(context);
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}
	const { user } = session;
	return {
		props: { user }
	};
};
