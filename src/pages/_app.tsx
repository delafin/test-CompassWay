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
		// Array of all the paths that doesn't need layout
		if ([`/`].includes(appProps.router.pathname)) return <Component {...pageProps} />;

		return (
			<Layout>
				<Component {...pageProps} />
			</Layout>
		);
	};

	return <SessionProvider session={session}>{getContent()}</SessionProvider>;

	// Use a LayoutComponent variable
	// that switches to actual Layout or React.Fragment (no layout)
	// accordingly to pathname:

	// You can use includes() to check only one path without nesting:
	// const isLayoutNeeded = [`/dashboard`].includes(appProps.router.pathname);
	// You can use path.startsWith to check all the paths, example:
	// 	const isLayoutNeeded = appProps.router.pathname.startsWith(`/dashboard`);
	// 	const LayoutComponent = isLayoutNeeded ? Layout : React.Fragment;

	// 	return (
	// 		<SessionProvider session={session}>
	// 			<LayoutComponent>
	// 				<Component {...pageProps} />
	// 			</LayoutComponent>
	// 		</SessionProvider>
	// 	);
};

export default MyApp;
