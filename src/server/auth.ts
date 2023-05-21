import { type GetServerSidePropsContext } from 'next';
import { type DefaultSession, type NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { User as PrismaUser } from '@prisma/client';

import { prisma, userValidationEmail } from '~server/db';

import { compare } from 'bcryptjs';
import { env } from '~/env.mjs';

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
			login: string;
			sender: number;
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
		login?: string;
		sender?: number;
	}
}
// declare module 'next-auth' {
// 	interface AdapterUser {
// 		login?: string;
// 	}
// }
declare module 'next-auth' {
	interface User extends PrismaUser {}
}

// declare module 'next-auth/user'
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	// Include user.id on session
	session: {
		strategy: 'jwt'
	},
	callbacks: {
		// session: ({ session, user }) => ({
		// 	...session,
		// 	user: {
		// 		...session.user,
		// 		id: user.id
		// 	}
		// })
		session: async ({ session, token }) => {
			if (session?.user) {
				session.user.id = token.uid!; // token.sub
				session.user.login = token.login!;
				session.user.sender = token.sender!;
			}
			return session;
		},
		jwt: async ({ user, token }) => {
			if (user) {
				token.uid = user.id;
				token.login = user.login!;
				token.sender = user.sender!;
			}
			return token;
		},
		async redirect({ url, baseUrl }) {
			return baseUrl;
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
					console.log(user);
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
	// pages: {
	// 	signIn: '/as',
	// 	signOut: '/',
	// 	newUser: '/dashboard'
	// }
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
