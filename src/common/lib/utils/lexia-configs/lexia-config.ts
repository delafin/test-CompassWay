import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { InitialConfigType, InitialEditorStateType } from '@lexical/react/LexicalComposer';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import Theme from '~lib/utils/lexia-configs/theme';

export const lexicalConfig = (editorState?: InitialEditorStateType): InitialConfigType => {
	return {
		// The editor theme
		theme: Theme,
		namespace: 'en',
		// Handling of errors during update
		onError(error: Error) {
			throw error;
		},
		// Any custom nodes go here
		nodes: [
			HeadingNode,
			ListNode,
			ListItemNode,
			QuoteNode,
			CodeNode,
			CodeHighlightNode,
			TableNode,
			TableCellNode,
			TableRowNode,
			AutoLinkNode,
			LinkNode
		],
		editable: !editorState,
		editorState: editorState ? editorState : null
	};
};
