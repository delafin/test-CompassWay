import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { useRouter } from 'next/router';

import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import Layout from '~/common/layout/layout';
import { dbApi } from '~store/db/prisma-handler';
import { wrapper } from '~store/store';

import '~/styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
	const router = useRouter();
	const getContent = () => {
		if ([`/`].includes(router.pathname))
			return (
				<ApiProvider api={dbApi}>
					<Component {...pageProps} />
				</ApiProvider>
			);

		return (
			<ApiProvider api={dbApi}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ApiProvider>
		);
	};

	return <SessionProvider session={session}>{getContent()}</SessionProvider>;
};

export default wrapper.withRedux(MyApp);
