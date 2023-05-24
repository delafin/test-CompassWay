import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { authOptions } from '~server/auth';
import { userGetAllMessages } from '~server/db';

const getMessages = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed!' });
	}
	if (!session) {
		return res.status(401).json({ message: 'Unauthorized!' });
	}
	const messages = await userGetAllMessages({
		sender: `${req.query.user as string}`,
		skip: +req.query.skip!,
		take: +req.query.take!
	});
	res.json(messages);
};
export default getMessages;
