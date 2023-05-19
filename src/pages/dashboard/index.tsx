import { GetServerSideProps, type NextPage } from 'next';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';

import EmailForm from '~/common/components/email-form/email-form';
import { authOptions } from '~/server/auth';

type TProps = {
	session: Session;
};

const dashboard: NextPage<TProps> = ({
	session: {
		user: { id, email }
	}
}) => {
	return <EmailForm userId={id} userEmail={email!} />;
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
