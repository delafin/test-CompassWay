import type { NextApiRequest, NextApiResponse } from 'next';

import { userCreateMessage } from '~server/db';

interface NextApiRequested extends NextApiRequest {
	body: {
		sender: string;
		recipient: string;
		subject: string;
		message: string;
	};
}

const createMessage = async (req: NextApiRequested, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}
	if (!req.body) {
		return res.status(404).json({ message: 'Request data is empty!' });
	}
	const message = await userCreateMessage({
		sender: req.body.sender,
		recipient: req.body?.recipient,
		subject: req.body?.subject,
		message: req.body?.message
	});

	res.json(message);
};

export default createMessage;
