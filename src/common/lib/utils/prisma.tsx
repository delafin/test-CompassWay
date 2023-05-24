import type { User } from '@prisma/client';
import type { PartialSelect } from '~/types/global';

export async function fetchNewUser(data: PartialSelect<User, 'id' | 'image' | 'emailVerified' | 'sender'>) {
	const response = await fetch('/api/auth/create-user', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!response.ok) {
		// return response.json().then((result) => {

		// 	throw new Error(`Error. ${response}, status: ${response.status}` || `Could not fetch !`);
		// });
		return response.json().then((result: { message: string }) => {
			throw new Error(`Error: ${result.message} Status: ${response.status}`);
		});
	}
	return response;
}

export async function fetchNewMessage(data: { userId: string; message: string }) {
	const response = await fetch('/api/db/create-message', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!response.ok) {
		return response.json().then((result: { message: string }) => {
			throw new Error(`Error: ${result.message} Status: ${response.status}`);
		});
	}
	return response;
}

export async function fetchAllMessages(data: { userId: string; skip: number; take: number }) {
	const response = await fetch('/api/db/get-messages', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!response.ok) {
		return response.json().then((result: { message: string }) => {
			throw new Error(`Error: ${result.message} Status: ${response.status}`);
		});
	}
	return response;
}
