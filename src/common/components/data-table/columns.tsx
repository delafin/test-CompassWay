'use client';

import { TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '~/common/components/shadcn-ui/button';
import AutoLinkPlugin from '~/common/lib/utils/lexia-configs/auto-link-plugin';
import type { Data } from '~/types/global';
import CodeHighlightPlugin from '~lib/utils/lexia-configs/code-highlight-plugin';
import { lexicalConfig } from '~lib/utils/lexia-configs/lexia-config';
import ListMaxIndentLevelPlugin from '~lib/utils/lexia-configs/list-max-indent-level-plugin';

import { Checkbox } from '~ui/shadcn-ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator
} from '~ui/shadcn-ui/dropdown-menu';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Data>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
			/>
		),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'senderEmail',
		header: ({ column }) => {
			return (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Sender Email
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		}
	},
	{
		accessorKey: 'recipient',
		header: ({ column }) => (
			<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
				recipient Email
				<ArrowUpDown className='ml-2 h-4 w-4' />
			</Button>
		)

		//  <div className='text-right'>Amount</div>,
		// cell: ({ row }) => {
		// 	const amount = parseFloat(row.getValue('amount'));
		// 	const formatted = new Intl.NumberFormat('en-US', {
		// 		style: 'currency',
		// 		currency: 'USD'
		// 	}).format(amount);

		// 	return <div className='text-right font-medium'>{formatted}</div>;
		// }
	},
	{
		accessorKey: 'subject',
		header: () => <Button variant='ghost'>Letter Subject</Button>
	},
	{
		accessorKey: 'message',
		header: () => <Button variant='ghost'>Letter Body</Button>,
		cell: ({ row }) => {
			return (
				<div className='overflow-hidden max-h-64 overflow-y-scroll'>
					<LexicalComposer initialConfig={lexicalConfig(row.getValue('message'))}>
						<ContentEditable className='min-h-[150px] resize-none text-[15px] relative caret-[#444] px-2 py-2 w-full border-[1px] border-neutral-400 outline-neutral-400' />
						<AutoFocusPlugin />
						<CodeHighlightPlugin />
						<ListPlugin />
						<LinkPlugin />
						<AutoLinkPlugin />
						<ListMaxIndentLevelPlugin maxDepth={7} />
						<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
					</LexicalComposer>
				</div>
			);
		}
	},

	{
		id: 'actions',
		cell: ({ row }) => {
			const info = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='bg-white'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							className='cursor-pointer hover:bg-gray-400/50'
							onClick={() => void navigator.clipboard.writeText(info.id)}
						>
							Copy user ID
						</DropdownMenuItem>
						<DropdownMenuItem
							className='cursor-pointer hover:bg-gray-400/50'
							onClick={() => void navigator.clipboard.writeText(info.senderEmail)}
						>
							Copy Sender&apos;s Email
						</DropdownMenuItem>
						<DropdownMenuItem
							className='cursor-pointer hover:bg-gray-400/50'
							onClick={() => () => void navigator.clipboard.writeText(info.recipient)}
						>
							Copy Recipients Email
						</DropdownMenuItem>
						<DropdownMenuItem
							className='cursor-pointer hover:bg-gray-400/50'
							onClick={() => void navigator.clipboard.writeText(info.subject)}
						>
							Copy Letter Subject
						</DropdownMenuItem>
						<DropdownMenuItem
							className='cursor-pointer hover:bg-gray-400/50'
							onClick={() => void navigator.clipboard.writeText(info.message)}
						>
							Copy Letter Body
						</DropdownMenuItem>
						<DropdownMenuSeparator />
					</DropdownMenuContent>

					{/* <DropdownMenuContent align='start'>
						<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
							<SortAsc className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
							Asc
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
							<SortDesc className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
							Desc
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
							<EyeOff className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
							Hide
						</DropdownMenuItem>
					</DropdownMenuContent>
					 */}
				</DropdownMenu>
			);
		}
	}
];
