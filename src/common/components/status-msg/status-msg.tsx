import { type NextPage } from 'next';

type TStatusMsg = {
	status?: boolean;
	errorMsg?: string;
	successMsg?: string;
};

const StatusMsg: NextPage<TStatusMsg> = ({ status, errorMsg, successMsg }) => {
	const ComponentError =
		errorMsg && errorMsg != '' ? (
			<div className='col-span-2 w-full'>
				<div className='mt-1 pl-4 text-red-500'>{errorMsg}</div>
			</div>
		) : null;

	const ComponentLoading = status ? (
		<div className='col-span-2 w-full'>
			<div className='mt-1 pl-4 text-green-500'>Loading...</div>
		</div>
	) : null;

	const ComponentSucsess =
		successMsg && successMsg != '' ? (
			<div className='col-span-2 w-full'>
				<div className='mt-1 pl-4 text-green-500'>{successMsg}</div>
			</div>
		) : null;
	return ComponentError || ComponentLoading || ComponentSucsess || null;
};

export default StatusMsg;
