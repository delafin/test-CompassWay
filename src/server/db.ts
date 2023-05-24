import { type Message, PrismaClient, type User } from '@prisma/client';
import { PartialSelect } from '~/types/global';

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
	const userResponse = await prisma.user.findMany();
	// .then((result) => JSON.stringify(result))
	// .catch((err) => JSON.stringify(err))
	// .finally(prisma.$disconnect);
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

	return userResponse;
}

export async function userCreate(data: PartialSelect<User, 'id' | 'image' | 'emailVerified' | 'sender'>) {
	const userResponse = await prisma.user.create({
		data
	});
	return userResponse;
}

export async function userCreateMessage(data: PartialSelect<Message, 'id' | 'createdAt' | 'updatedAt'>) {
	const userResponse = await prisma.message.create({
		data
	});
	return userResponse;
}

export async function userGetAllMessages({
	sender,
	skip,
	take
}: {
	sender: string;
	skip?: number;
	take?: number;
}) {
	if ((!skip && skip !== 0) || !take) {
		const userResponse = await prisma.message.findMany({
			orderBy: [
				{
					createdAt: 'desc'
				}
			],
			where: {
				sender
			},
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		});
		return userResponse;
	} else {
		const userResponse = await prisma.message.findMany({
			skip,
			take,
			where: {
				sender
			},
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		});
		return userResponse;
	}
}
