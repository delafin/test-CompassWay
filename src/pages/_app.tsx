import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';

import Layout from '~/common/layout/layout';

import '~/styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
	...appProps
}) => {
	const getContent = () => {
		// array of all the paths that doesn't need layout
		if ([`/`].includes(appProps.router.pathname)) return <Component {...pageProps} />;

		return (
			<Layout>
				<Component {...pageProps} />
			</Layout>
		);
	};

	return <SessionProvider session={session}>{getContent()}</SessionProvider>;
};

export default MyApp;
