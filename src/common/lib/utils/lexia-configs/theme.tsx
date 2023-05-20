const Theme = {
	ltr: 'ltr',
	rtl: 'rtl',
	placeholder:
		'text-[#999] overflow-hidden absolute text-ellipsis text-[15px] select-none inline-block pointer-events-none left-2.5 top-[15px]',
	paragraph: 'relative mb-2 m-0 last:mb-0',
	quote:
		'text-[15px] text-[rgb(101,103,107)] ml-5 m-0 pl-4 border-l-[rgb(206,208,212)] border-l-4 border-solid',
	heading: {
		h1: 'text-2xl text-[rgb(5,5,5)] font-normal mb-3 m-0 p-0',
		h2: 'text-[15px] text-[rgb(101,103,107)] font-bold uppercase mt-2.5 m-0 p-0',
		h3: 'text-[12px] text-[rgb(101,103,107)] font-bold uppercase mt-2 m-0 p-0',
		h4: 'text-[10x] text-[rgb(101,103,107)] font-bold uppercase mt-1.5 m-0 p-0',
		h5: 'text-[8px] text-[rgb(101,103,107)] font-bold uppercase mt-1 m-0 p-0'
	},
	list: {
		nested: {
			listitem: 'list-none'
		},
		ol: 'ml-4 m-0 p-0',
		ul: 'ml-4 m-0 p-0',
		listitem: 'mx-8 my-2'
	},
	image: 'block',
	link: 'text-[rgb(33,111,219)] no-underline',
	text: {
		bold: 'font-bold',
		italic: 'italic',
		overflowed: 'block',
		hashtag: 'block',
		underline: 'underline',
		strikethrough: 'line-through',
		underlineStrikethrough: 'overline', // wrong, need custom config
		code: 'bg-[rgb(240,242,245)] text-[94%] px-1 py-px'
	},
	code: 'bg-[rgb(240,242,245)] block leading-[1.53] text-[13px] overflow-x-auto relative my-2 m-0 pl-[52px] pr-2 py-2 before:content-[attr(data-gutter)] before:absolute before:bg-[#eee] before:text-[#777] before:whitespace-pre-wrap before:text-right before:min-w-[25px] before:p-2 before:border-r-[#ccc] before:border-r before:border-solid before:left-0 before:top-0 after:content-[attr(data-highlight-language)] after:text-[10px] after:uppercase after:absolute after:text-[rgba(0,0,0,0.5)] after:p-[3px] after:right-[3px] after:top-0',
	codeHighlight: {
		atrule: 'text-[#07a]',
		attr: 'text-[#07a]',
		boolean: 'text-[#905]',
		builtin: 'text-[#690]',
		cdata: 'text-[slategray]',
		char: 'text-[#690]',
		class: 'text-[#dd4a68]',
		'class-name': 'text-[#dd4a68]',
		comment: 'text-[slategray]',
		constant: 'text-[#905]',
		deleted: 'text-[#905]',
		doctype: 'text-[slategray]',
		entity: 'text-[#9a6e3a]',
		function: 'text-[#dd4a68]',
		important: 'text-[#e90]',
		inserted: 'text-[#690]',
		keyword: 'text-[#07a]',
		namespace: 'text-[#e90]',
		number: 'text-[#905]',
		operator: 'text-[#9a6e3a]',
		prolog: 'text-[slategray]',
		property: 'text-[#905]',
		punctuation: 'text-[#999]',
		regex: 'text-[#e90]',
		selector: 'text-[#690]',
		string: 'text-[#690]',
		symbol: 'text-[#905]',
		tag: 'text-[#905]',
		url: 'text-[#9a6e3a]',
		variable: 'text-[#e90]'
	}
};

export default Theme;
