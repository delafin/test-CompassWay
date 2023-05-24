import { forwardRef, useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const EditorCapturePlugin = forwardRef((props: any, ref: any) => {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		ref!.current = editor;
		return () => {
			ref!.current = null;
		};
	}, [editor, ref]);

	return null;
});
EditorCapturePlugin.displayName = 'Editor';

export default EditorCapturePlugin;
