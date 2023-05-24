import type { Message } from '@prisma/client';

type PartialSelect<T, K extends PropertyKey = PropertyKey> = Partial<Pick<T, Extract<keyof T, K>>> &
	Omit<T, K> extends infer O
	? { [P in keyof O]: O[P] }
	: never;

type Data = Pick<Message, 'id' | 'sender' | 'message' | 'recipient' | 'subject'> & { senderEmail: string };

type TFetchedError = {
	error: {
		data: string & { detail: string };
		status: string;
	};
};
