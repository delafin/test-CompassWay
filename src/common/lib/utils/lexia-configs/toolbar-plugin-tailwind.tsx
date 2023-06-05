import { type NextPage } from 'next';

import { Button } from '~ui/shadcn-ui/button';
import { Icons } from '~ui/shadcn-ui/icons';
import { Toggle } from '~ui/shadcn-ui/toggle';

type TToolbarPluginTailwind = {
	children?: React.ReactNode;
};

const ToolbarPluginTailwind: NextPage<TToolbarPluginTailwind> = ({}) => {
	return (
		<div className='bg-white p-3 rounded-t-md  flex items-center justify-left gap-2 border-gray-400 border-[1px] text-black/50'>
			<div className='flex items-center justify-between h-5 gap-1'>
				<Button type='button' disabled={false} aria-label='Undo' className='p-2 hover:bg-gray-500/10'>
					<Icons.toolbarRotateLeft className='h-4 w-4' />
				</Button>
				<Button type='button' disabled={false} aria-label='Undo ' className='p-2 hover:bg-gray-500/10'>
					<Icons.toolbarRotateRight className='h-4 w-4' />
				</Button>
				{/* <Toggle aria-label='Undo' className='p-2 hover:bg-gray-500/10'>
					<Icons.toolbarRotateLeft className='h-4 w-4' />
				</Toggle> */}
				{/* <Toggle aria-label='Redo' className='p-2 hover:bg-gray-500/10'>
					<Icons.toolbarRotateRight className='h-4 w-4' />
				</Toggle> */}
			</div>
			<div className='flex items-center justify-between h-5 gap-1'>
				<Toggle
					aria-label='Toggle bold'
					className='p-2 hover:bg-gray-500/10 data-[state=on]:bg-gray-500/10 data-[state=on]:text-black'
				>
					<Icons.toolbarBold className='h-4 w-4' />
				</Toggle>
				<Toggle
					aria-label='Toggle italic'
					className='p-2 hover:bg-gray-500/10 data-[state=on]:bg-gray-500/10 data-[state=on]:text-black'
				>
					<Icons.toolbarItalic className='h-4 w-4' />
				</Toggle>
				<Toggle
					aria-label='Toggle underline'
					className='p-2 hover:bg-gray-500/10 data-[state=on]:bg-gray-500/10 data-[state=on]:text-black'
				>
					<Icons.toolbarUnderline className='h-4 w-4' />
				</Toggle>
				<Toggle
					aria-label='Toggle underline'
					className='p-2 hover:bg-gray-500/10 data-[state=on]:bg-gray-500/10 data-[state=on]:text-black'
				>
					<Icons.toolbarStrikethrough className='h-4 w-4' />
				</Toggle>
			</div>
			<div className='flex items-center justify-between h-5 gap-1'>
				<Toggle
					aria-label='Toggle code'
					className='p-2 hover:bg-gray-500/10 data-[state=on]:bg-gray-500/10 data-[state=on]:text-black'
				>
					<Icons.toolbarCode className='h-4 w-4' />
				</Toggle>
				<Toggle
					aria-label='Toggle reply'
					className='p-2 hover:bg-gray-500/10 data-[state=on]:bg-gray-500/10 data-[state=on]:text-black'
				>
					<Icons.toolbarReply className='h-4 w-4' />
				</Toggle>
				<Toggle
					aria-label='Toggle link'
					className='p-2 hover:bg-gray-500/10 data-[state=on]:bg-gray-500/10 data-[state=on]:text-black'
				>
					<Icons.toolbarLink className='h-4 w-4' />
				</Toggle>
			</div>
			<div className='flex items-center justify-between h-5 gap-1'>
				<Toggle
					aria-label='Align Left'
					className='p-2 hover:bg-gray-500/10 data-[state=on]:bg-gray-500/10 data-[state=on]:text-black'
				>
					<Icons.toolbarAlignLeft className='h-4 w-4' />
				</Toggle>
				<Toggle
					aria-label='Align Center'
					className='p-2 hover:bg-gray-500/10 data-[state=on]:bg-gray-500/10 data-[state=on]:text-black '
				>
					<Icons.toolbarAlignCenter className='h-4 w-4' />
				</Toggle>
				<Toggle
					aria-label='Align Right'
					className='p-2 hover:bg-gray-500/10 data-[state=on]:bg-gray-500/10 data-[state=on]:text-black'
				>
					<Icons.toolbarAlignRight className='h-4 w-4' />
				</Toggle>
			</div>
		</div>
	);
};

export default ToolbarPluginTailwind;
