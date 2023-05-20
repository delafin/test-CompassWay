import { useState } from 'react';

import { NextPage } from 'next';

import { TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
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
import { $getRoot, $getSelection, EditorState } from 'lexical';
import * as Yup from 'yup';
import { fetchNewLetter } from '~/common/lib/utils/prisma';
import AutoLinkPlugin from '~lib/utils/lexia-configs/auto-link-plugin';
import CodeHighlightPlugin from '~lib/utils/lexia-configs/code-highlight-plugin';
import { lexicalConfig } from '~lib/utils/lexia-configs/lexia-config';
import ListMaxIndentLevelPlugin from '~lib/utils/lexia-configs/list-max-indent-level-plugin';
import Theme from '~lib/utils/lexia-configs/theme';
import ToolbarPlugin from '~lib/utils/lexia-configs/toolbar-plugin';

// import TreeViewPlugin from './plugins/TreeViewPlugin';
import StatusMsg from '../status-msg/status-msg';

type TProps = {
	userEmail: string;
	userId: string;
};

const EmailForm: NextPage<TProps> = ({ userEmail, userId }) => {
	const [successMsg, setSuccessMsg] = useState<string>('');
	const [errorMsg, setErrorMsg] = useState<string>('');

	//  Lexical Settings

	function Placeholder() {
		return (
			<div className='text-[#999] overflow-hidden absolute text-ellipsis text-[15px] select-none inline-block pointer-events-none left-2.5 top-[11px]'>
				Enter some rich text...
			</div>
		);
	}

	// const editorConfig: InitialConfigType = {
	// 	// The editor theme
	// 	theme: Theme,
	// 	namespace: 'en',
	// 	// Handling of errors during update
	// 	onError(error: Error) {
	// 		throw error;
	// 	},
	// 	// Any custom nodes go here
	// 	nodes: [
	// 		HeadingNode,
	// 		ListNode,
	// 		ListItemNode,
	// 		QuoteNode,
	// 		CodeNode,
	// 		CodeHighlightNode,
	// 		TableNode,
	// 		TableCellNode,
	// 		TableRowNode,
	// 		AutoLinkNode,
	// 		LinkNode
	// 	]
	// 	// editorState: editorStateJSONString
	// };

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
			sendersEmail: userEmail,
			recipientsEmail: '',
			letterSubject: '',
			letterBody: ''
		},
		validationSchema: Yup.object({
			sendersEmail: Yup.string()
				.typeError('Incorrect data type!')
				.email('Please, use a valid email address')
				.required('This field is required!'),
			recipientsEmail: Yup.string()
				.typeError('Incorrect data type!')
				.email('Please, use a valid email address')
				.required('This field is required!'),
			letterSubject: Yup.string()
				.typeError('Incorrect data type!')
				.required('This field is required!')
				.min(3, 'Please, use at least 3 characters!')
				.max(50, 'Please, use less than 50 characters!'),
			letterBody: Yup.string().typeError('Incorrect data type!').required('This field is required!')
		}),
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			setErrorMsg(() => '');
			setSuccessMsg(() => '');
			try {
				const result = await fetchNewLetter({
					id: userId,
					sendersEmail: values.sendersEmail,
					recipientsEmail: values.recipientsEmail,
					subject: values.letterSubject,
					letterBody: values.letterBody
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

	console.log(formikSendEmail.values.letterBody);
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
								id='sendersEmail'
								type='email'
								autoComplete='on'
								placeholder=' '
								{...formikSendEmail.getFieldProps('sendersEmail')}
								className={clsx(
									'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
									{
										'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
											formikSendEmail.touched.sendersEmail && formikSendEmail.errors.sendersEmail,
										'border-neutral-400 outline-neutral-400 text-black dark:text-white':
											!formikSendEmail.touched.sendersEmail || !formikSendEmail.errors.sendersEmail
									}
								)}
							/>
							<label
								htmlFor='sendersEmail'
								className={clsx(
									'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
									{
										'text-red-500 dark:text-red-500':
											formikSendEmail.touched.sendersEmail && formikSendEmail.errors.sendersEmail,
										'text-black dark:text-white':
											!formikSendEmail.touched.sendersEmail || !formikSendEmail.errors.sendersEmail
									}
								)}
							>
								Your Email
							</label>
						</div>
						<ErrorMsgSend
							touch={formikSendEmail.touched.sendersEmail}
							error={formikSendEmail.errors.sendersEmail}
							field='sendersEmail'
						/>
					</div>
					<div className='w-full'>
						<div className='group relative'>
							<input
								id='recipientsEmail'
								type='email'
								autoComplete='on'
								placeholder=' '
								{...formikSendEmail.getFieldProps('recipientsEmail')}
								className={clsx(
									'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
									{
										'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
											formikSendEmail.touched.recipientsEmail && formikSendEmail.errors.recipientsEmail,
										'border-neutral-400 outline-neutral-400 text-black dark:text-white':
											!formikSendEmail.touched.recipientsEmail || !formikSendEmail.errors.recipientsEmail
									}
								)}
							/>
							<label
								htmlFor='recipientsEmail'
								className={clsx(
									'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
									{
										'text-red-500 dark:text-red-500':
											formikSendEmail.touched.recipientsEmail && formikSendEmail.errors.recipientsEmail,
										'text-black dark:text-white':
											!formikSendEmail.touched.recipientsEmail || !formikSendEmail.errors.recipientsEmail
									}
								)}
							>
								Recipient Email
							</label>
						</div>
						<ErrorMsgSend
							touch={formikSendEmail.touched.recipientsEmail}
							error={formikSendEmail.errors.recipientsEmail}
							field='recipientsEmail'
						/>
					</div>
					<div className='w-full'>
						<div className='group relative'>
							<input
								id='letterSubject'
								type='email'
								autoComplete='on'
								placeholder=' '
								{...formikSendEmail.getFieldProps('letterSubject')}
								className={clsx(
									'peer w-full rounded-[4px] border-[1px] py-4 px-4 text-xs font-medium dark:bg-[#393547] dark:caret-white caret-black',
									{
										'outline-red-500 border-red-500 text-red-500 dark:text-red-500':
											formikSendEmail.touched.letterSubject && formikSendEmail.errors.letterSubject,
										'border-neutral-400 outline-neutral-400 text-black dark:text-white':
											!formikSendEmail.touched.letterSubject || !formikSendEmail.errors.letterSubject
									}
								)}
							/>
							<label
								htmlFor='letterSubject'
								className={clsx(
									'absolute left-3 top-0 -translate-y-1/2 bg-white dark:bg-[#393547] dark:peer-focus:bg-[#393547] px-2 text-xs font-medium transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:bg-white',
									{
										'text-red-500 dark:text-red-500':
											formikSendEmail.touched.letterSubject && formikSendEmail.errors.letterSubject,
										'text-black dark:text-white':
											!formikSendEmail.touched.letterSubject || !formikSendEmail.errors.letterSubject
									}
								)}
							>
								Letter Subject
							</label>
						</div>
						<ErrorMsgSend
							touch={formikSendEmail.touched.letterSubject}
							error={formikSendEmail.errors.letterSubject}
							field='letterSubject'
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
											{...formikSendEmail.getFieldProps('letterBody')}
											className={clsx(
												'min-h-[150px] resize-none text-[15px] relative caret-[#444] px-2 py-2 w-full border-[1px]',
												{
													'outline-red-500 border-red-500':
														formikSendEmail.touched.letterBody && formikSendEmail.errors.letterBody,
													'border-neutral-400 outline-neutral-400  ':
														!formikSendEmail.touched.letterBody || !formikSendEmail.errors.letterBody
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
										console.log('coly', JSON.stringify(editorState));
										formikSendEmail.setFieldValue('letterBody', JSON.stringify(editorState));
									}}
								/>
							</div>
						</div>
					</LexicalComposer>
					<ErrorMsgSend
						touch={formikSendEmail.touched.letterBody}
						error={formikSendEmail.errors.letterBody}
						field='letterBody'
					/>
					{/* Custom Error Message */}
					<StatusMsg errorMsg={errorMsg} successMsg={successMsg} status={formikSendEmail.isSubmitting} />

					<button
						disabled={formikSendEmail.isSubmitting ? true : false}
						className={clsx(
							'block relative mx-auto font-medium mt-6 cursor-pointer overflow-hidden rounded-md px-4 py-2 text-center text-white w-full col-span-2',
							{
								'bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40':
									formikSendEmail.isSubmitting,
								'bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40':
									!formikSendEmail.isSubmitting
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
