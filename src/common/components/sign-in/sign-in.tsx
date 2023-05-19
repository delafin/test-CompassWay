import { type CSSProperties, type Dispatch, type SetStateAction, useEffect, useState } from 'react';

import { type NextPage } from 'next';
import { signIn } from 'next-auth/react';
import router from 'next/router';

import clsx from 'clsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchNewUser } from '~/common/utils/utils';

import StatusMsg from '../status-msg/status-msg';

type TModal = {
	isUser?: boolean;
};

const Modal: NextPage<TModal> = ({ isUser = true }) => {
	const [isSignUp, setIsSignUp] = useState<boolean>(!isUser);

	return (
		<div className='fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center bg-black/50'>
			<div className='relative w-full max-w-[80%] overflow-hidden bg-transparent  md:max-w-sm'>
				<div
					className='relative left-0 flex h-auto w-full items-start justify-start transition-all'
					// style={
					// 	{
					// 		// maxHeight: isSignUp ? `${signUpModalRef?.current?.scrollHeight}px` : 'unset',
					// 		// maxHeight: isSignUp
					// 		// 	? `${signUpModalRef?.current?.scrollHeight}px`
					// 		// 	: `${signInModalRef?.current?.scrollHeight}px`,
					// 		// left: isSignUp ? `-100%` : `unset`
					// 	}
					// }
					// {`${passwordShow ? 'Hide' : 'Show'}`}
					// style={styleModalAdaptiveHeight}
					// dark:bg-[#34313F] dark:bg-[#221F2C]
				>
					<div
						className='min-w-full overflow-hidden'
						style={{
							display: isSignUp ? `none` : `unset`
						}}
					>
						<FormSignIn isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
					</div>
					<div
						className='min-w-full overflow-hidden'
						style={{
							display: isSignUp ? `unset` : `none`
						}}
					>
						<FormSignUp isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
					</div>
				</div>
			</div>
		</div>
	);
};

type FormProps = {
	isSignUp: boolean;
	setIsSignUp: Dispatch<SetStateAction<boolean>>;
};

const FormSignIn: NextPage<FormProps> = ({ isSignUp, setIsSignUp }) => {
	const [passwordShow, setPasswordShow] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>('');

	const formikSignIn = useFormik({
		initialValues: {
			LoginPassword: '',
			LoginEmail: ''
		},
		validationSchema: Yup.object({
			LoginPassword: Yup.string().typeError('Please, use only numbers!').required('This field is required!'),
			LoginEmail: Yup.string()
				.typeError('Incorrect data type!')
				.email('Please, use a valid email address')
				.required('This field is required!')
		}),
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			setErrorMsg(() => '');
			await signIn('credentials', {
				email: values.LoginEmail,
				password: values.LoginPassword,
				redirect: false,
				callbackUrl: '/dashboard'
			})
				.then((result) => {
					if (!result?.ok && typeof result?.error === 'string') {
						setErrorMsg(() => result.error!);
					}
					router.push('/dashboard');
				})
				.catch((err) => {
					setErrorMsg(() => (err.message as string) ?? 'Something went wrong');
				});
			setSubmitting(false);
		}
	});

	const ErrorMsgSignIn = ({
		touch,
		error,
		field
	}: {
		touch: boolean | undefined;
		error: string | undefined;
		field: keyof typeof formikSignIn.errors;
	}) => {
		const Component =
			touch && error ? <div className='mt-1 pl-4 text-red-500'>{formikSignIn.errors[field]}</div> : null;
		return Component;
	};

	return (
		<div className='w-full min-w-full rounded-lg bg-white p-6 dark:bg-[#221F2C]'>
			<div className='mt-3 flex flex-col items-center justify-center gap-3'>
				<p className='text-center text-3xl text-black dark:text-white'>
					{'Sign In'.length > 20 ? `${'Sign In'.slice(0, 20)}...` : 'Sign In'}
				</p>
			</div>
			<form
				onSubmit={formikSignIn.handleSubmit}
				onReset={formikSignIn.handleReset}
				className={`mx-auto mt-5 flex w-full min-w-full flex-col items-center justify-center gap-3`}
			>
				<div className='w-full'>
					<div className='group relative'>
						<input
							id='LoginEmail'
							type='email'
							autoComplete='on'
							placeholder=' '
							{...formikSignIn.getFieldProps('LoginEmail')}
							className={clsx(
								'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
								{
									'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
										formikSignIn.touched.LoginEmail && formikSignIn.errors.LoginEmail,
									'border-neutral-400 outline-neutral-400 text-black dark:text-white':
										!formikSignIn.touched.LoginEmail || !formikSignIn.errors.LoginEmail
								}
							)}
						/>
						<label
							htmlFor='LoginEmail'
							className={clsx(
								'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
								{
									'text-red-500 dark:text-red-500':
										formikSignIn.touched.LoginEmail && formikSignIn.errors.LoginEmail,
									'text-black dark:text-white':
										!formikSignIn.touched.LoginEmail || !formikSignIn.errors.LoginEmail
								}
							)}
						>
							Your Email
						</label>
					</div>
					<ErrorMsgSignIn
						touch={formikSignIn.touched.LoginEmail}
						error={formikSignIn.errors.LoginEmail}
						field='LoginEmail'
					/>
				</div>
				<div className='w-full'>
					<div className='group relative'>
						<input
							id='LoginPassword'
							type={`${passwordShow ? 'text' : 'password'}`}
							autoComplete='password'
							placeholder=' '
							{...formikSignIn.getFieldProps('LoginPassword')}
							className={clsx(
								'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
								{
									'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
										formikSignIn.touched.LoginPassword && formikSignIn.errors.LoginPassword,
									'border-neutral-400 outline-neutral-400 text-black dark:text-white':
										!formikSignIn.touched.LoginPassword || !formikSignIn.errors.LoginPassword
								}
							)}
						/>
						<label
							htmlFor='LoginPassword'
							className={clsx(
								'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
								{
									'text-red-500 dark:text-red-500':
										formikSignIn.touched.LoginPassword && formikSignIn.errors.LoginPassword,
									'text-black dark:text-white':
										!formikSignIn.touched.LoginPassword || !formikSignIn.errors.LoginPassword
								}
							)}
						>
							Your Password
						</label>
						<div
							className={clsx('absolute right-1 top-1/2  w-6 h-6 -translate-y-1/2', {
								'text-red-500 dark:text-red-500':
									formikSignIn.touched.LoginPassword && formikSignIn.errors.LoginPassword,
								'text-[#393547a3] dark:text-white':
									!formikSignIn.touched.LoginPassword || !formikSignIn.errors.LoginPassword
							})}
							onClick={() => setPasswordShow((show) => !show)}
						>
							{passwordShow ? <EyeClose /> : <EyeOpen />}
						</div>
					</div>
					<ErrorMsgSignIn
						touch={formikSignIn.touched.LoginPassword}
						error={formikSignIn.errors.LoginPassword}
						field='LoginPassword'
					/>
				</div>

				{/* Custom Error Message */}
				<StatusMsg errorMsg={errorMsg} status={formikSignIn.isSubmitting} />

				<button
					type='submit'
					disabled={formikSignIn.isSubmitting ? true : false}
					className={clsx(
						'block relative mx-auto font-medium mt-6 cursor-pointer overflow-hidden rounded-md px-4 py-2 text-center text-white w-full',
						{
							'bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40':
								formikSignIn.isSubmitting,
							'bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40':
								!formikSignIn.isSubmitting
						}
					)}
				>
					<span>Submit</span>
				</button>
			</form>
			<div className='relative mx-auto mt-5 flex items-center justify-center bg-inherit after:absolute after:top-1/2 after:h-[.1px] after:w-full after:-translate-y-1/2 after:bg-black'>
				<span className='relative z-[1] bg-inherit px-2 py-1 text-black dark:text-white'>or</span>
			</div>
			<div className='mx-auto mt-5 flex w-full flex-col items-center justify-center gap-5'>
				<button
					disabled={formikSignIn.isSubmitting ? true : false}
					onClick={async () => await signIn('google', { callbackUrl: '/dashboard' })}
					className={clsx(
						'block relative mx-auto font-medium mt-6 cursor-pointer overflow-hidden rounded-md px-4 py-2 text-center text-white w-full',
						{
							'bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40':
								formikSignIn.isSubmitting,
							'bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40':
								!formikSignIn.isSubmitting
						}
					)}
				>
					Sign In with Google
				</button>
				<p className='text-center text-gray-400'>
					Don&apos;t have an account yet?{' '}
					<button
						disabled={formikSignIn.isSubmitting ? true : false}
						className={clsx('cursor-pointer', {
							'text-gray-700': formikSignIn.isSubmitting,
							'text-blue-700': !formikSignIn.isSubmitting
						})}
						onClick={() => setIsSignUp((is) => !is)}
					>
						Sign Up
					</button>
				</p>
			</div>
		</div>
	);
};

export const FormSignUp: NextPage<FormProps> = ({ isSignUp, setIsSignUp }) => {
	const [passwordShow, setPasswordShow] = useState<boolean>(false);
	const [successMsg, setSuccessMsg] = useState<string>('');
	const [errorMsg, setErrorMsg] = useState<string>('');

	const formikSignUp = useFormik({
		initialValues: {
			userFullName: '',
			userLogin: '',
			userEmail: '',
			userPassword: '',
			userPasswordRepeat: '',
			userAgree: ''
		},
		validationSchema: Yup.object({
			userFullName: Yup.string()
				.typeError('Incorrect data type!')
				.required('This field is required!')
				.matches(/^([^0-9]*)$/, 'Please, use only letters!')
				.min(3, 'Please, use at least 3 characters!')
				.max(50, 'Please, use less than 50 characters!'),
			userLogin: Yup.string()
				.typeError('Incorrect data type!')
				.min(3, 'Please, use at least 3 characters!')
				.required('This field is required!')
				.test(
					'userLogin',
					'Please, use underscores or dashes instead of spaces!',
					(userLogin) => !userLogin.includes(' ')
				),
			userEmail: Yup.string()
				.typeError('Incorrect data type!')
				.email('Please, use a valid email address')
				.required('This field is required!'),
			userPassword: Yup.string()
				.typeError('Please, use only numbers!')
				.required('This field is required!')
				.matches(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%\^&\*])(?=.{8,})/,
					'Please, use more than 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character!'
				),
			userPasswordRepeat: Yup.string()
				.required('This field is required!')
				.when('userPassword', {
					is: (val: string) => (val && val.length > 0 ? true : false),
					then: () => Yup.string().oneOf([Yup.ref('userPassword')], 'Both passwords must be the same!')
					// then: Yup.string().oneOf([Yup.ref('userPassword')], 'Both passwords must be the same!')
				}),
			userAgree: Yup.boolean()
				.typeError('Incorrect data type!')
				.required('This field is required!')
				.oneOf([true], 'This field is required!')
		}),
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			setErrorMsg(() => '');
			setSuccessMsg(() => '');
			try {
				const result = await fetchNewUser({
					name: values.userFullName,
					password: values.userPassword,
					login: values.userLogin,
					email: values.userEmail
				});
				setSuccessMsg(() => 'You have successfully registered, now you can login with your credentials!');
			} catch (err: any) {
				setErrorMsg(() => err.message as string);
			}
			console.log(successMsg);
			console.log(errorMsg);
			setSubmitting(false);
		}
	});
	const ErrorMsgSignUp = ({
		touch,
		error,
		field
	}: {
		touch: boolean | undefined;
		error: string | undefined;
		field: keyof typeof formikSignUp.errors;
	}) => {
		const Component =
			touch && error ? <div className='mt-1 pl-4 text-red-500'>{formikSignUp.errors[field]}</div> : null;
		return Component;
	};

	return (
		<div className='w-full min-w-full rounded-lg bg-white p-6 text-black transition-all dark:bg-[#221F2C]'>
			<div className='mt-3 flex flex-col items-center justify-center gap-3'>
				<p className='text-center text-3xl text-black dark:text-white'>
					{'Sign Up'.length > 20 ? `${'Sign Up'.slice(0, 20)}...` : 'Sign Up'}
				</p>
				<form
					onSubmit={formikSignUp.handleSubmit}
					onReset={formikSignUp.handleReset}
					// className={`mx-auto my-5 flex w-full min-w-full max-w-sm flex-col items-center justify-between gap-5`}
					className={`mx-auto my-5 w-full min-w-full max-w-sm gap-5 grid grid-cols-2`}
				>
					<div className='w-full'>
						<div className='group relative'>
							<input
								id='userFullName'
								type='text'
								autoComplete='name'
								placeholder=' '
								{...formikSignUp.getFieldProps('userFullName')}
								className={clsx(
									'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
									{
										'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
											formikSignUp.touched.userLogin && formikSignUp.errors.userLogin,
										'border-neutral-400 outline-neutral-400 text-black dark:text-white':
											!formikSignUp.touched.userLogin || !formikSignUp.errors.userLogin
									}
								)}
							/>
							<label
								htmlFor='userFullName'
								className={clsx(
									'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
									{
										'text-red-500 dark:text-red-500':
											formikSignUp.touched.userLogin && formikSignUp.errors.userLogin,
										'text-black dark:text-white':
											!formikSignUp.touched.userLogin || !formikSignUp.errors.userLogin
									}
								)}
							>
								Your full name
							</label>
						</div>
						<ErrorMsgSignUp
							touch={formikSignUp.touched.userFullName}
							error={formikSignUp.errors.userFullName}
							field='userFullName'
						/>
					</div>
					<div className='w-full'>
						<div className='group relative'>
							<input
								id='userLogin'
								type='text'
								placeholder=' '
								{...formikSignUp.getFieldProps('userLogin')}
								className={clsx(
									'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
									{
										'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
											formikSignUp.touched.userLogin && formikSignUp.errors.userLogin,
										'border-neutral-400 outline-neutral-400 text-black dark:text-white':
											!formikSignUp.touched.userLogin || !formikSignUp.errors.userLogin
									}
								)}
							/>
							<label
								htmlFor='userLogin'
								className={clsx(
									'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
									{
										'text-red-500 dark:text-red-500':
											formikSignUp.touched.userLogin && formikSignUp.errors.userLogin,
										'text-black dark:text-white':
											!formikSignUp.touched.userLogin || !formikSignUp.errors.userLogin
									}
								)}
							>
								Your Login
							</label>
						</div>
						<ErrorMsgSignUp
							touch={formikSignUp.touched.userLogin}
							error={formikSignUp.errors.userLogin}
							field='userLogin'
						/>
					</div>
					<div className='w-full col-span-2'>
						<div className='group relative'>
							<input
								id='userEmail'
								type='email'
								autoComplete='on'
								placeholder=' '
								{...formikSignUp.getFieldProps('userEmail')}
								className={clsx(
									'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
									{
										'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
											formikSignUp.errors.userEmail && formikSignUp.touched.userEmail,
										'border-neutral-400 outline-neutral-400 text-black dark:text-white':
											!formikSignUp.errors.userEmail || !formikSignUp.touched.userEmail
									}
								)}
							/>
							<label
								htmlFor='userEmail'
								className={clsx(
									'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
									{
										'text-red-500 dark:text-red-500':
											formikSignUp.errors.userEmail && formikSignUp.touched.userEmail,
										'text-black dark:text-white':
											!formikSignUp.errors.userEmail || !formikSignUp.touched.userEmail
									}
								)}
							>
								Your Email
							</label>
						</div>
						<ErrorMsgSignUp
							touch={formikSignUp.touched.userEmail}
							error={formikSignUp.errors.userEmail}
							field='userEmail'
						/>
					</div>
					<div className='w-full col-span-2'>
						<div className='group relative'>
							<input
								id='userPassword'
								type={`${passwordShow ? 'text' : 'password'}`}
								autoComplete='new-password'
								placeholder=' '
								{...formikSignUp.getFieldProps('userPassword')}
								className={clsx(
									'peer w-full rounded-[4px] border-[1px] py-4 px-4  pr-8 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
									{
										'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
											formikSignUp.touched.userPassword && formikSignUp.errors.userPassword,
										'border-neutral-400 outline-neutral-400 text-black dark:text-white':
											!formikSignUp.touched.userPassword || !formikSignUp.errors.userPassword
									}
								)}
							/>
							<label
								htmlFor='userPassword'
								className={clsx(
									'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
									{
										'text-red-500 dark:text-red-500':
											formikSignUp.touched.userPassword && formikSignUp.errors.userPassword,
										'text-black dark:text-white':
											!formikSignUp.touched.userPassword || !formikSignUp.errors.userPassword
									}
								)}
							>
								New Password
							</label>
							<div
								className={clsx('absolute right-1 top-1/2  w-6 h-6 -translate-y-1/2', {
									'text-red-500 dark:text-red-500':
										formikSignUp.touched.userPassword && formikSignUp.errors.userPassword,
									'text-[#393547a3] dark:text-white':
										!formikSignUp.touched.userPassword || !formikSignUp.errors.userPassword
								})}
								onClick={() => setPasswordShow((show) => !show)}
							>
								{passwordShow ? <EyeClose /> : <EyeOpen />}
							</div>
						</div>
						{/* <div
							className='mt-2 cursor-pointer text-black dark:text-white'
							onClick={() => setPasswordShow((show) => !show)}
						>
							{`${passwordShow ? 'Hide' : 'Show'}`} password
						</div> */}
						<ErrorMsgSignUp
							touch={formikSignUp.touched.userPassword}
							error={formikSignUp.errors.userPassword}
							field='userPassword'
						/>
					</div>
					<div className='w-full col-span-2'>
						<div className='group relative'>
							<input
								id='userPasswordRepeat'
								type='password'
								autoComplete='password'
								placeholder=' '
								{...formikSignUp.getFieldProps('userPasswordRepeat')}
								className={clsx(
									'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
									{
										'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
											formikSignUp.touched.userPasswordRepeat && formikSignUp.errors.userPasswordRepeat,
										'border-neutral-400 outline-neutral-400 text-black dark:text-white':
											!formikSignUp.touched.userPasswordRepeat || !formikSignUp.errors.userPasswordRepeat
									}
								)}
							/>
							<label
								htmlFor='userPasswordRepeat'
								className={clsx(
									'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
									{
										'text-red-500 dark:text-red-500':
											formikSignUp.touched.userPasswordRepeat && formikSignUp.errors.userPasswordRepeat,
										'text-black dark:text-white':
											!formikSignUp.touched.userPasswordRepeat || !formikSignUp.errors.userPasswordRepeat
									}
								)}
							>
								Repeat Password
							</label>
						</div>
						<ErrorMsgSignUp
							touch={formikSignUp.touched.userPasswordRepeat}
							error={formikSignUp.errors.userPasswordRepeat}
							field='userPasswordRepeat'
						/>
					</div>
					<div className='w-full col-span-2'>
						<div className='group relative'>
							<label
								htmlFor='userAgree'
								className={clsx(
									'relative flex flex-row justify-start gap-2 items-center text-xs font-medium transition-all  cursor-pointer',
									{
										'text-red-500 dark:text-red-500':
											formikSignUp.touched.userAgree && formikSignUp.errors.userAgree,
										'text-black dark:text-white':
											!formikSignUp.touched.userAgree || !formikSignUp.errors.userAgree
									}
								)}
							>
								<span
									className={clsx('relative border-[1px] rounded-sm w-3 h-3 transition-all', {
										'bg-transparent text-red-500 border-red-500':
											formikSignUp.touched.userAgree && formikSignUp.errors.userAgree,
										'bg-transparent text-sky-400 border-sky-400':
											!formikSignUp.touched.userAgree || !formikSignUp.errors.userAgree
									})}
								>
									<input
										id='userAgree'
										type='checkbox'
										{...formikSignUp.getFieldProps('userAgree')}
										className={clsx('peer appearance-none absolute', {
											'': formikSignUp.touched.userAgree && formikSignUp.errors.userAgree,
											'': !formikSignUp.touched.userAgree || !formikSignUp.errors.userAgree
										})}
									/>
									<div className='relative h-full w-full opacity-0 peer-checked:opacity-100'>
										<CheckBoxV />
									</div>
								</span>
								<p
									className={clsx('text-xs font-medium transition-all', {
										'text-red-500 dark:text-red-500':
											formikSignUp.touched.userAgree && formikSignUp.errors.userAgree,
										'text-black dark:text-white':
											!formikSignUp.touched.userAgree || !formikSignUp.errors.userAgree
									})}
								>
									You agree to the&nbsp;
									<span className='cursor-pointer text-blue-700'>Privacy Policy</span>
								</p>
							</label>
						</div>
						<ErrorMsgSignUp
							touch={formikSignUp.touched.userAgree}
							error={formikSignUp.errors.userAgree}
							field='userAgree'
						/>
					</div>
					{/* Custom Error Message */}
					<StatusMsg errorMsg={errorMsg} successMsg={successMsg} status={formikSignUp.isSubmitting} />
					<button
						type='submit'
						disabled={formikSignUp.isSubmitting ? true : false}
						className={clsx(
							'block relative mx-auto font-medium mt-6 cursor-pointer overflow-hidden rounded-md px-4 py-2 text-center text-white w-full col-span-2',
							{
								'bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40':
									formikSignUp.isSubmitting,
								'bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40':
									!formikSignUp.isSubmitting
							}
						)}
					>
						<span>Submit</span>
					</button>
				</form>

				<p className='text-center text-gray-400'>
					Have an account?{' '}
					<button
						disabled={formikSignUp.isSubmitting ? true : false}
						className={clsx('cursor-pointer', {
							'text-gray-700': formikSignUp.isSubmitting,
							'text-blue-700': !formikSignUp.isSubmitting
						})}
						onClick={() => setIsSignUp((is) => !is)}
					>
						Sign In
					</button>
				</p>
			</div>
		</div>
	);
};

type SVGS = {
	w?: string;
	h?: string;
	visible?: boolean;
	absolute?: boolean;
	fill?: string;
	stroke?: string;
};

export const CheckBoxV: NextPage<SVGS> = ({
	w = '11px',
	h = '8px',
	visible = true,
	fill = 'none',
	stroke = 'currentColor',
	absolute = true
}) => {
	return (
		<div
			style={{
				width: w,
				height: h,
				display: visible ? 'block' : 'none',
				position: absolute ? 'absolute' : 'relative',
				top: absolute ? '50%' : 'unset',
				left: absolute ? '50%' : 'unset',
				transform: absolute ? 'translate(-50%, -50%)' : 'unset'
			}}
		>
			<svg width='100%' height='100%' viewBox='0 0 11 8' fill={fill} xmlns='http://www.w3.org/2000/svg'>
				<path
					d='M1.08905 4.08905L3.91088 6.91088L9.55456 1.26721'
					stroke={stroke}
					strokeWidth='1.5'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
		</div>
	);
};
type SVGEyes = {
	w?: string;
	h?: string;
	visible?: boolean;
	absolute?: boolean;
	fill?: string;
	stroke?: string;
};
export const EyeOpen: NextPage<SVGEyes> = ({
	w = '100%',
	h = '100%',
	visible = true,
	fill = 'currentColor',
	stroke = 'currentColor'
}) => {
	return (
		<div
			style={{
				width: w,
				height: h,
				display: visible ? 'block' : 'none',
				cursor: 'pointer',
				color: 'inherit'
			}}
		>
			<svg
				stroke={stroke}
				fill={fill}
				strokeWidth='0'
				viewBox='0 0 1024 1024'
				height='100%'
				width='100%'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path d='M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z'></path>
			</svg>
		</div>
	);
};
export const EyeClose: NextPage<SVGEyes> = ({
	w = '100%',
	h = '100%',
	visible = true,
	fill = 'currentColor',
	stroke = 'currentColor'
}) => {
	return (
		<div
			style={{
				width: w,
				height: h,
				display: visible ? 'block' : 'none',
				cursor: 'pointer',
				color: 'inherit'
			}}
		>
			<svg
				stroke={stroke}
				fill={fill}
				strokeWidth='0'
				viewBox='0 0 1024 1024'
				height='100%'
				width='100%'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path d='M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5zm-63.57-320.64L836 122.88a8 8 0 0 0-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 0 0 0 11.31L155.17 889a8 8 0 0 0 11.31 0l712.15-712.12a8 8 0 0 0 0-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 0 0-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 0 1 146.2-106.69L401.31 546.2A112 112 0 0 1 396 512z'></path>
				<path d='M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 0 0 227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 0 1-112 112z'></path>
			</svg>
		</div>
	);
};

export default Modal;
