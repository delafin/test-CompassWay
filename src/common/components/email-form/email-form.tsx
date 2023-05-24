import { useState } from 'react';

import { NextPage } from 'next';

import { TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import clsx from 'clsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AutoLinkPlugin from '~lib/utils/lexia-configs/auto-link-plugin';
import CodeHighlightPlugin from '~lib/utils/lexia-configs/code-highlight-plugin';
import { lexicalConfig } from '~lib/utils/lexia-configs/lexia-config';
import ListMaxIndentLevelPlugin from '~lib/utils/lexia-configs/list-max-indent-level-plugin';
import ToolbarPlugin from '~lib/utils/lexia-configs/toolbar-plugin';
import { usePushNewMessageMutation } from '~store/db/prisma-handler';

import { userCreateMessage } from '~server/db';

// import TreeViewPlugin from './plugins/TreeViewPlugin';
import StatusMsg from '../status-msg/status-msg';

type TProps = {
	userEmail: string;
	userId: string;
	userSender: number;
};

const EmailForm: NextPage<TProps> = ({ userEmail, userId, userSender }) => {
	const [successMsg, setSuccessMsg] = useState<string>('');
	const [errorMsg, setErrorMsg] = useState<string>('');

	const [sendEmail, { isError, isLoading, error }] = usePushNewMessageMutation();

	//  Lexical Settings

	function Placeholder() {
		return (
			<div className='text-[#999] overflow-hidden absolute text-ellipsis text-[15px] select-none inline-block pointer-events-none left-2.5 top-[11px]'>
				Enter some rich text...
			</div>
		);
	}

	// function onChange(editorState: EditorState) {
	// 	editorState.read(() => {
	// 		// Read the contents of the EditorState here.
	// 		const root = $getRoot();
	// 		const selection = $getSelection();
	// 		console.log(root, selection);
	// 	});
	// }

	//  Formik Settings

	const formikSendEmail = useFormik({
		initialValues: {
			sender: userEmail,
			recipient: '',
			subject: '',
			message: ''
		},
		validationSchema: Yup.object({
			sender: Yup.string()
				.typeError('Incorrect data type!')
				.email('Please, use a valid email address')
				.required('This field is required!'),
			recipient: Yup.string()
				.typeError('Incorrect data type!')
				.email('Please, use a valid email address')
				.required('This field is required!')
				.max(254, 'Please, use less than 254 characters!'),
			subject: Yup.string()
				.typeError('Incorrect data type!')
				.required('This field is required!')
				.min(3, 'Please, use at least 3 characters!')
				.max(255, 'Please, use less than 255 characters!'),
			message: Yup.string()
				.typeError('Incorrect data type!')
				.required('This field is required!')
				.max(5000, 'Please, use less than 5000 characters!')
		}),
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			setErrorMsg(() => '');
			setSuccessMsg(() => '');
			await sendEmail({
				sender: userId,
				recipient: values.recipient,
				subject: values.subject,
				message: values.message
			});

			if (isError) {
				setErrorMsg(() =>
					(error as { data: { message: string } }).data.message
						? (error as { data: { message: string } }).data.message
						: 'Something went wrong!'
				);
			} else {
				setSuccessMsg(() => 'You have successfully sent a message!');
			}

			resetForm();
			setSubmitting(false);
		}
	});

	const ErrorMsgSend = ({
		touch,
		error,
		field
	}: {
		touch: boolean | undefined;
		error: string | undefined;
		field: keyof typeof formikSendEmail.errors;
	}) => {
		const Component =
			touch && error ? <div className='mt-1 pl-4 text-red-500'>{formikSendEmail.errors[field]}</div> : null;
		return Component;
	};

	return (
		<section className='text-black w-full'>
			<div className=''>
				{/* Formik */}
				<form
					onSubmit={formikSendEmail.handleSubmit}
					onReset={formikSendEmail.handleReset}
					className={`mx-auto mt-5 flex w-full min-w-full flex-col items-center justify-center gap-3`}
				>
					<div className='w-full'>
						<div className='group relative'>
							<input
								id='sender'
								type='email'
								autoComplete='on'
								placeholder=' '
								{...formikSendEmail.getFieldProps('sender')}
								className={clsx(
									'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
									{
										'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
											formikSendEmail.touched.sender && formikSendEmail.errors.sender,
										'border-neutral-400 outline-neutral-400 text-black dark:text-white':
											!formikSendEmail.touched.sender || !formikSendEmail.errors.sender
									}
								)}
							/>
							<label
								htmlFor='sender'
								className={clsx(
									'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
									{
										'text-red-500 dark:text-red-500':
											formikSendEmail.touched.sender && formikSendEmail.errors.sender,
										'text-black dark:text-white':
											!formikSendEmail.touched.sender || !formikSendEmail.errors.sender
									}
								)}
							>
								Your Email
							</label>
						</div>
						<ErrorMsgSend
							touch={formikSendEmail.touched.sender}
							error={formikSendEmail.errors.sender}
							field='sender'
						/>
					</div>
					<div className='w-full'>
						<div className='group relative'>
							<input
								id='recipient'
								type='email'
								autoComplete='on'
								placeholder=' '
								{...formikSendEmail.getFieldProps('recipient')}
								className={clsx(
									'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
									{
										'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
											formikSendEmail.touched.recipient && formikSendEmail.errors.recipient,
										'border-neutral-400 outline-neutral-400 text-black dark:text-white':
											!formikSendEmail.touched.recipient || !formikSendEmail.errors.recipient
									}
								)}
							/>
							<label
								htmlFor='recipient'
								className={clsx(
									'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
									{
										'text-red-500 dark:text-red-500':
											formikSendEmail.touched.recipient && formikSendEmail.errors.recipient,
										'text-black dark:text-white':
											!formikSendEmail.touched.recipient || !formikSendEmail.errors.recipient
									}
								)}
							>
								Recipient Email
							</label>
						</div>
						<ErrorMsgSend
							touch={formikSendEmail.touched.recipient}
							error={formikSendEmail.errors.recipient}
							field='recipient'
						/>
					</div>
					<div className='w-full'>
						<div className='group relative'>
							<input
								id='subject'
								type='text'
								autoComplete='on'
								placeholder=' '
								{...formikSendEmail.getFieldProps('subject')}
								className={clsx(
									'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
									{
										'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
											formikSendEmail.touched.subject && formikSendEmail.errors.subject,
										'border-neutral-400 outline-neutral-400 text-black dark:text-white':
											!formikSendEmail.touched.subject || !formikSendEmail.errors.subject
									}
								)}
							/>
							<label
								htmlFor='subject'
								className={clsx(
									'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
									{
										'text-red-500 dark:text-red-500':
											formikSendEmail.touched.subject && formikSendEmail.errors.subject,
										'text-black dark:text-white':
											!formikSendEmail.touched.subject || !formikSendEmail.errors.subject
									}
								)}
							>
								Letter Subject
							</label>
						</div>
						<ErrorMsgSend
							touch={formikSendEmail.touched.subject}
							error={formikSendEmail.errors.subject}
							field='subject'
						/>
					</div>

					{/* Rich Text */}
					<LexicalComposer initialConfig={lexicalConfig('')}>
						<div className='text-black relative leading-5 font-normal text-left mx-auto my-5 rounded-t-[10px] rounded-sm w-full'>
							<ToolbarPlugin />
							<div className='relative bg-white'>
								<RichTextPlugin
									contentEditable={
										<ContentEditable
											role='textbox'
											{...formikSendEmail.getFieldProps('message')}
											className={clsx(
												'min-h-[150px] resize-none text-[15px] relative caret-[#444] px-2 py-2 w-full border-[1px]',
												{
													'outline-red-500 border-red-500':
														formikSendEmail.touched.message && formikSendEmail.errors.message,
													'border-neutral-400 outline-neutral-400  ':
														!formikSendEmail.touched.message || !formikSendEmail.errors.message
												}
											)}
										/>
									}
									placeholder={<Placeholder />}
									ErrorBoundary={LexicalErrorBoundary}
								/>
								<HistoryPlugin />
								{/* <TreeViewPlugin /> */}
								<AutoFocusPlugin />
								<CodeHighlightPlugin />
								<ListPlugin />
								<LinkPlugin />
								<AutoLinkPlugin />
								<ListMaxIndentLevelPlugin maxDepth={7} />
								<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
								<OnChangePlugin
									onChange={(editorState) => {
										void (async () => {
											await formikSendEmail.setFieldValue('message', JSON.stringify(editorState));
										})();
									}}
								/>
							</div>
						</div>
					</LexicalComposer>
					<ErrorMsgSend
						touch={formikSendEmail.touched.message}
						error={formikSendEmail.errors.message}
						field='message'
					/>
					{/* Custom Error Message */}
					<StatusMsg errorMsg={errorMsg} successMsg={successMsg} status={formikSendEmail.isSubmitting} />

					<button
						disabled={formikSendEmail.isSubmitting || isLoading ? true : false}
						className={clsx(
							'block relative mx-auto font-medium mt-6 cursor-pointer overflow-hidden rounded-md px-4 py-2 text-center text-white w-full col-span-2',
							{
								'bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40':
									formikSendEmail.isSubmitting || isLoading,
								'bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40':
									!formikSendEmail.isSubmitting && !isLoading
							}
						)}
						type='submit'
					>
						Submit
					</button>
				</form>
			</div>
		</section>
	);
};

export default EmailForm;
