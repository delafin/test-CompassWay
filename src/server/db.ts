import { PrismaClient, type User } from '@prisma/client';

import { env } from '~/env.mjs';

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
	});

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function userList() {
	const userResponse = await prisma.user
		.findMany()
		.then((result) => JSON.stringify(result))
		.catch((err) => JSON.stringify(err))
		.finally(prisma.$disconnect);
	return userResponse;
}
export async function userValidationEmail(email: string) {
	const userResponse = await prisma.user.findFirst({
		where: {
			email
		}
	});
	// .then((result) => JSON.stringify(result))
	// .catch((err) => JSON.stringify(err))
	// .finally(prisma.$disconnect);
	return userResponse;
}

export async function userValidationCredentials(email: string, password: string) {
	const userResponse = await prisma.user.findFirstOrThrow({
		where: {
			email,
			password
		}
	});

	return userResponse as User;
}

export async function userCreate(data: PartialSelect<User, 'id' | 'image' | 'emailVerified' | 'sender'>) {
	const userResponse = await prisma.user
		.create({
			data
		})
		// .then((result) => JSON.stringify(result))
		// .catch((err) => JSON.stringify(err))
		.finally(prisma.$disconnect);
	return userResponse;
}
