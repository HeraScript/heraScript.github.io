(function(mod) {
	mod(CodeMirror);
})(function(CodeMirror) {
	CodeMirror.defineSimpleMode('hera', {
		start: [
			{ regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: 'string' },
			{ regex: /(function)(\s+)([a-z$][\w$]*)/, token: ['keyword', null, 'variable-2'] },
			{
				regex: /(?:function|`(\w+)`|var|val|return|infixl|infixr|infix|postfix|prefix|if|for|else|->|native|!!|=>)/,
				token: 'keyword',
			},
			{ regex: /true|false|null|undefined/, token: 'atom' },
			{ regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: 'number' },
			{ regex: /\/\/.*/, token: 'comment' },
			{ regex: /\/(?:[^\\]|\\.)*?\//, token: 'variable-3' },
			{ regex: /\/\*/, token: 'comment', next: 'comment' },
			{
				regex: /[-+\/*=<>!`]+/,
				token: 'operator',
			},
			{ regex: /[{[(]/, indent: true },
			{ regex: /[}\])]/, dedent: true },
			{ regex: /[a-z$][\w$]*/, token: 'variable' },
			{ regex: /native\s+"/, token: 'meta', mode: { spec: 'javascript', end: /"/ } },
		],
		comment: [{ regex: /.*?\*\//, token: 'comment', next: 'start' }, { regex: /.*/, token: 'comment' }],
		meta: {
			dontIndentStates: ['comment'],
			lineComment: '//',
		},
	});
});
