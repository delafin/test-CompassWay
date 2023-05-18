import type { NextApiRequest, NextApiResponse } from 'next';

import { userCreate, userValidationEmail } from '~server/db';

import { genSalt, hash } from 'bcryptjs';

const signUp = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}
	if (!req.body) {
		return res.status(404).json({ message: 'Request data is empty!' });
	}
	const isUniqueUser = await userValidationEmail(req.body.email);
	if (isUniqueUser) {
		return res.status(422).json({ message: 'User Already Exist!' });
	}
	const salt = await genSalt(12);
	const newUser = userCreate({
		name: req.body.name,
		email: req.body.email,
		password: await hash(req.body.password, salt),
		login: req.body.login
	});

	res.json(newUser);
};

export default signUp;
