import { type GetServerSidePropsContext } from 'next';
import { getServerSession, type NextAuthOptions, type DefaultSession, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { env } from '~/env.mjs';
import { prisma, userValidationEmail } from '~server/db';
import { compare } from 'bcryptjs';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession['user'];
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

declare module 'next-auth/jwt/types' {
	interface JWT extends DefaultJWT {
		uid?: string;
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	callbacks: {
		// session: ({ session, user, }) => ({
		// 	...session,
		// 	user: {
		// 		...session.user,
		// 		id: user.id
		// 	}
		// }),
		session: async ({ session, token }) => {
			if (session?.user) {
				session.user.id = token.uid!; // token.sub
			}
			return session;
		},
		jwt: async ({ user, token }) => {
			if (user) {
				token.uid = user.id;
			}
			return token;
		}
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {},
			async authorize(credentials, req) {
				if (credentials) {
					const { email, password } = credentials as {
						email: string;
						password: string;
					};
					// const user = async userValidationCredentials(credentials.email, credentials.password)
					const user = await userValidationEmail(email);

					if (!user || !user?.password) {
						throw new Error(`The login or password you entered is incorrect.`);
					} else {
						const passwordValidation = await compare(password, user?.password);
						if (!passwordValidation) {
							throw new Error(`The login or password you entered is incorrect.`);
						}
					}
					return user;
				} else {
					throw new Error(`The login or password you entered is incorrect.`);
				}
			}
		}),
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		})
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	]
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext['req'];
	res: GetServerSidePropsContext['res'];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
// function CredentialProvider(arg0: {
// 	name: string;
// 	credentials: {};
// 	authorize(credentials: any, req: any): Promise<any>;
// }): import('next-auth/providers').Provider {
// 	throw new Error('Function not implemented.');
// }
