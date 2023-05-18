import { type CSSProperties, type Dispatch, type SetStateAction, useEffect, useState } from 'react';

import { type NextPage } from 'next';
import { signOut } from 'next-auth/react';

import * as Yup from 'yup';

type TList = {
	isUser?: boolean;
};

const List: NextPage<TList> = ({ isUser = true }) => {
	const [isSignUp, setIsSignUp] = useState<boolean>(!isUser);

	return (
		<div className='fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center bg-black/50'>
			<div className='relative w-full max-w-[80%] overflow-hidden bg-transparent  md:max-w-sm'>
				<div className='relative left-0 flex h-auto w-full items-start justify-start transition-all'>
					<div className='w-full min-w-full rounded-lg bg-white p-6 dark:bg-[#221F2C]'>
						<div className='mt-3 flex flex-col items-center justify-center gap-3'>
							<p className='text-center text-3xl text-black dark:text-white'>Dashboard</p>
						</div>
						<div className='mt-4'>s das das adsad </div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default List;
