import { type User } from '@prisma/client';

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
		return response.json().then((result) => {
			throw new Error(`Error: ${result.message} Status: ${response.status}`);
		});
	}
	return response;
}

export async function fetchNewLetter(data: {
	id: string;
	sender: string;
	recipient: string;
	subject: string;
	message: string;
}) {
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
		return response.json().then((result) => {
			throw new Error(`Error: ${result.message} Status: ${response.status}`);
		});
	}
	return response;
}
