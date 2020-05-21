(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Hera"] = factory();
	else
		root["Hera"] = factory();
})((typeof self !== "undefined" ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.Parser = exports.error = exports.ok = exports.Reply = exports.State = void 0;
function eq(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
class State {
    constructor(source, position = 0, _userState) {
        this.source = source;
        this.position = position;
        this._userState = _userState;
    }
    seek(delta) {
        return new State(this.source, this.position + delta, this._userState);
    }
    getRowColumn() {
        const lines = this.source.split('\n');
        let position = 0;
        let raw = 0;
        while (position < this.position) {
            if (this.position <= position + lines[raw].length) {
                break;
            }
            position += lines[raw].length + 1;
            raw++;
        }
        const column = this.position - position;
        return { raw, column };
    }
    rest() {
        return this.source.slice(this.position);
    }
    equals(src) {
        return src && this.source === src.source && this.position === src.position && eq(this._userState, src._userState);
    }
    toString() {
        return `
			State: {
				source: ${this.source.length <= 100 ? `"${this.source}"` : `"${this.source.slice(0, 100)}"...`}
				position: ${this.position}
				userState: ${JSON.stringify(this._userState)}
			}
		`;
    }
}
exports.State = State;
class Reply {
    constructor(state, success, value, expected) {
        this.state = state;
        this.success = success;
        this.value = value;
        this.expected = expected;
    }
    toString() {
        return `
			Reply { 
				success: ${this.success}
				${this.success ? 'value: ' + String.raw `${this.value}` : 'expected: ' + this.expected()}
				state: ${this.state.toString().replace(/^(?!\s*$)/gm, '\t\t')}
			}
		`;
    }
    equals(st) {
        return (st &&
            this.state.equals(st.state) &&
            this.success === st.success &&
            (this.success
                ? eq(this.value, st.value)
                : (this.expected === undefined && st.expected === undefined) || this.expected() === st.expected()));
    }
}
exports.Reply = Reply;
function ok(state, value) {
    return new Reply(state, true, value);
}
exports.ok = ok;
function error(state, expect) {
    return new Reply(state, false, undefined, expect);
}
exports.error = error;
class Parser {
    constructor(runParser) {
        this.runParser = runParser;
    }
    toString() {
        return this.runParser.toString();
    }
}
exports.Parser = Parser;
function parse(parser, state) {
    return parser.runParser(state);
}
exports.parse = parse;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.Op = void 0;
const p = __importStar(__webpack_require__(2));
const printer_1 = __importDefault(__webpack_require__(3));
const identStart = p.oneOf('_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const identLetter = p.oneOf('_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
const opStart = p.oneOf('+-*/=!$%&^~@?_><:|\\.');
const opLetter = p.oneOf('+-*/=!$%&^~@?_><:|\\.');
const lexer = p.buildTokenParser({
    multiCommentStart: p.string('/*'),
    multiCommentEnd: p.string('*/'),
    singleCommentLine: p.string('//'),
    identifierStart: identStart,
    identifierLetter: identLetter,
    opStart: opStart,
    opLetter: opLetter,
    reservedNames: [
        'function',
        'return',
        'op',
        'infix',
        'infixl',
        'infixr',
        'prefix',
        'postfix',
        'var',
        'if',
        'else',
        'for',
        'native',
        '->',
    ],
    reservedOps: [],
    caseSensitive: true,
});
class Op {
    constructor() {
        this.operators = [];
        this.binaryOps = {};
        this.unaryOps = {};
        this.operators[0] = new p.OperatorTable();
        this.operators[0].infix.push(lexer.lexeme(p.seq(s => {
            s(p.string('`'));
            const ops = s(identStart);
            const opl = s(p.many(identLetter));
            s(p.string('`'));
            return (x, y) => `(${ops}${opl.join('')}(${x}, ${y}))`;
        })));
    }
}
exports.Op = Op;
class Stack {
    constructor(stack = []) {
        this.stack = stack;
    }
    push(x) {
        this.stack.push(x);
    }
    pop() {
        return this.stack.pop();
    }
    get head() {
        return this.stack[0];
    }
    get last() {
        return this.stack[this.stack.length - 1];
    }
    get length() {
        return this.stack.length;
    }
    peek(cursor) {
        return this.stack[cursor];
    }
}
class Scope {
    constructor() {
        this.stack = new Stack();
        this.currentCursor = -1;
        this.argsTable = this.stack.peek(0);
    }
    advance(step = 1) {
        const cursor = this.currentCursor + step;
        if (cursor + 1 > this.stack.length) {
            for (let k = 0; k < cursor + 1 - this.stack.length; k++) {
                this.stack.push(new Map());
            }
        }
        this.argsTable = this.stack.peek(cursor);
        this.currentCursor = cursor;
    }
    back(step) {
        const cursor = this.currentCursor - step;
        if (cursor >= 0) {
            this.argsTable = this.stack.peek(cursor);
            this.currentCursor = cursor;
        }
    }
    getArgsCount(name) {
        const argsTable = this.stack.peek(this.currentCursor + 1);
        return argsTable.get(name);
    }
    addArgsCount(name, count) {
        this.argsTable.set(name, count);
    }
}
function compile(source) {
    const printer = new printer_1.default();
    const opTable = new Op();
    let _expression;
    const expression = p.lazy(() => {
        if (!_expression) {
            const operators = opTable.operators.filter(Boolean);
            _expression = p.buildExpressionParser(operators, term);
        }
        return _expression;
    });
    /**
     * Generate executable statement through parsing operators defined by user.
     *
     * @param identifiers
     */
    function makeNativeExprParser(identifiers) {
        let initialCursor = 0;
        const nativeExprParser = p.many(p.seq(m => {
            m(p.notFollowedBy(lexer.semi));
            m(p.optional(lexer.stringLiteral));
            m(p.optional(lexer.charLiteral));
            const startCursor = m.state.position;
            const ident = m(p.optional(lexer.identifier));
            if (ident) {
                if (identifiers.indexOf(ident) > -1) {
                    return {
                        name: ident,
                        cursor: [startCursor - initialCursor, startCursor - initialCursor + ident.length],
                    };
                }
                else {
                    m(p.unexpected(`identifier ${ident}`));
                }
            }
            else {
                m(p.notFollowedBy(lexer.semi));
                m(p.anyChar);
            }
        }));
        const parser = p.seq(x => {
            initialCursor = x.state.position;
            const reply = p.parse(p.until(lexer.semi), new p.State(x.state.source.slice(x.state.position)));
            if (!reply.success || !reply.value) {
                x(p.fail('parsing error in nativeExpressionParser'));
                return;
            }
            const statement = reply.value;
            const cursorTable = x(nativeExprParser).filter(Boolean);
            function makeExpr(table) {
                let stm = statement;
                // Recording the cursor offset while replacing statement.
                let offset = 0;
                for (let i = 0; i < cursorTable.length; i++) {
                    const cursorItem = cursorTable[i];
                    const ident = table[cursorItem.name];
                    if (ident) {
                        const head = stm.slice(0, cursorItem.cursor[0] + offset);
                        const tail = stm.slice(cursorItem.cursor[1] + offset, stm.length);
                        stm = head + ident + tail;
                        offset += ident.length - (cursorItem.cursor[1] - cursorItem.cursor[0]);
                    }
                }
                return stm;
            }
            return makeExpr;
        });
        return parser;
    }
    const term = p.label('term', p.seq(m => {
        const transaction = printer.transaction();
        const arrowFunctionArgs = p.or(p.fmap(x => [x], lexer.identifier), lexer.parens(p.sepBy(lexer.identifier, lexer.comma)));
        const arrowFunctionBody = p.or(lexer.braces(p.seq(s => {
            transaction.indent();
            const sts = s(p.many(statement));
            transaction.dedent();
            return sts;
        })), p.fmap(x => {
            return ['return', x];
        }, expression));
        const arrowFunction = p.seq(m => {
            const args = m(arrowFunctionArgs);
            m(lexer.symbol('=>'));
            const body = m(arrowFunctionBody);
            if (m.success) {
                transaction.queue(`((${args.join(', ')}) => `);
                transaction.append('{\n');
                body.forEach(x => {
                    transaction.queue(x);
                });
                transaction.queue('})');
                return transaction.get();
            }
        });
        const nativeDirective = p.seq(m => {
            m(lexer.reserved('native'));
            return printer.get(m(lexer.stringLiteral));
        });
        const functionalOperator = p.fmap(op => {
            const transaction = printer.transaction();
            if (opTable.binaryOps[op]) {
                transaction.append('(function(x, y) {\n');
                transaction.indent();
                transaction.queue(`return ${opTable.binaryOps[op]('x', 'y')};`);
                transaction.dedent();
                transaction.append('\n})');
                return transaction.get();
            }
            else if (opTable.unaryOps[op]) {
                transaction.append('(function(x) {\n');
                transaction.indent();
                transaction.queue(`return ${opTable.unaryOps[op]('x')};`);
                transaction.dedent();
                transaction.append('\n})');
                return transaction.get();
            }
            else {
                throw new Error('Unknown operator: ' + op);
            }
        }, lexer.parens(lexer.operator));
        const arrayLiteral = p.fmap(xs => `[${xs.join(',')}]`, lexer.brackets(p.sepBy(expression, lexer.comma)));
        const rightSection = p.seq(m => {
            m(lexer.symbol('('));
            const op = m(lexer.operator);
            const expr = m(simpleExpressionParser);
            m(lexer.symbol(')'));
            if (opTable.binaryOps[op]) {
                const transaction = printer.transaction();
                transaction.queue('(function(x) {\n');
                transaction.indent();
                transaction.queue(`return ${opTable.binaryOps[op]('x', expr)}`);
                transaction.dedent();
                transaction.queue('\n})');
                return transaction.get();
            }
        });
        const leftSection = p.seq(m => {
            m(lexer.symbol('('));
            const expr = m(simpleExpressionParser);
            const op = m(lexer.operator);
            m(lexer.symbol(')'));
            if (opTable.binaryOps[op]) {
                const transaction = printer.transaction();
                transaction.queue('(function(x) {\n');
                transaction.indent();
                transaction.queue(`return ${opTable.binaryOps[op]('x', expr)}`);
                transaction.dedent();
                transaction.queue('\n})');
                return transaction.get();
            }
        });
        const simpleExpressionParser = p.or(p.triable(functionalOperator), p.triable(arrowFunction), arrayLiteral, p.triable(rightSection), p.triable(leftSection), p.fmap(x => `(${x})`, lexer.parens(expression)), p.fmap(x => `"${x}"`, lexer.stringLiteral), p.fmap(x => x.toString(), lexer.naturalOrFloat), nativeDirective, lexer.identifier);
        const simpleExpression = m(simpleExpressionParser);
        const functionApplication = p.fmap((args) => {
            const argCount = m._userState.scope.getArgsCount(simpleExpression);
            if (args.length < argCount) {
                args = args.concat(Array(argCount - args.length).fill(undefined));
            }
            if (args.every(x => !!x)) {
                return `${simpleExpression}(${args.join(', ')})`;
            }
            else {
                const params = [];
                const rest = [];
                for (let i = 0; i < args.length; i++) {
                    if (args[i] === undefined) {
                        // Auto-Increasing variable name
                        const v = String.fromCharCode(97 + i).toString();
                        rest.push(v);
                        params.push(v);
                    }
                    else {
                        params.push(args[i]);
                    }
                }
                const transaction = printer.transaction();
                transaction.append('(function(f) {\n');
                transaction.indent();
                transaction.queue(`return function(${rest.join(', ')}) {\n`);
                transaction.indent();
                transaction.queue(`return f(${params.join(', ')})\n`);
                transaction.dedent();
                transaction.queue('}\n');
                transaction.dedent();
                transaction.queue('}');
                transaction.append(`(${simpleExpression}))`);
                return transaction.get();
            }
        }, lexer.parens(p.sepBy(p.option(expression, undefined), lexer.comma)));
        return m(p.option(functionApplication, simpleExpression));
    }));
    const operatorStatement = p.seq(m => {
        const type = m(p.choice(['infixl', 'infixr', 'infix', 'prefix', 'postfix'].map(lexer.reserved)));
        const priority = m(lexer.natural);
        const op = m(lexer.operator);
        m(lexer.reserved('->'));
        function addOperator(unary, binary) {
            opTable.operators[priority] = opTable.operators[priority] || new p.OperatorTable();
            const table = opTable.operators[priority];
            if (type === 'infixl') {
                table.infixl.push(p.fmap(_ => binary, lexer.reservedOp(op)));
                opTable.binaryOps[op] = binary;
            }
            else if (type === 'infixr') {
                table.infixr.push(p.fmap(_ => binary, lexer.reservedOp(op)));
                opTable.binaryOps[op] = binary;
            }
            else if (type === 'infix') {
                table.infix.push(p.fmap(_ => binary, lexer.reservedOp(op)));
                opTable.binaryOps[op] = binary;
            }
            else if (type === 'prefix') {
                table.prefix.push(p.fmap(_ => unary, lexer.reservedOp(op)));
                opTable.unaryOps[op] = unary;
            }
            else if (type === 'postfix') {
                table.postfix.push(p.fmap(_ => unary, lexer.reservedOp(op)));
                opTable.unaryOps[op] = unary;
            }
        }
        const aliasParser = p.seq(s => {
            const f = s(lexer.identifier);
            s(p.lookAhead(lexer.semi));
            if (s.success) {
                addOperator((x) => `${f}(${x})`, (x, y) => `${f}(${x}, ${y})`);
            }
        });
        switch (type) {
            case 'infixl':
            case 'infxr':
            case 'infix':
                m(p.or(aliasParser, p.seq(s => {
                    const left = s(lexer.identifier);
                    s(lexer.symbol(op));
                    const right = s(lexer.identifier);
                    s(lexer.symbol('='));
                    const makeExpr = s(makeNativeExprParser([left, right]));
                    if (s.success) {
                        addOperator((x) => makeExpr({ [left]: x }), (x, y) => makeExpr({ [left]: x, [right]: y }));
                    }
                })));
                break;
            case 'prefix':
                m(p.or(aliasParser, p.seq(s => {
                    s(lexer.symbol(op));
                    const t = s(lexer.identifier);
                    s(lexer.symbol('='));
                    const makeExpr = s(makeNativeExprParser([t]));
                    if (s.success) {
                        addOperator((x) => makeExpr({ [t]: x }));
                    }
                })));
                break;
            case 'postfix':
                m(p.or(aliasParser, p.seq(s => {
                    const t = s(lexer.identifier);
                    s(lexer.symbol(op));
                    s(lexer.symbol('='));
                    const makeExpr = s(makeNativeExprParser([t]));
                    if (s.success) {
                        addOperator((x) => makeExpr({ [t]: x }));
                    }
                })));
                break;
        }
        m(lexer.semi);
        return '';
    });
    const functionStatement = makeScopeParser(p.seq(m => {
        const transaction = printer.transaction();
        m(lexer.reserved('function'));
        const name = m(lexer.identifier);
        const args = m(lexer.parens(p.sepBy(lexer.identifier, lexer.comma)));
        if (m.success) {
            m._userState.scope.addArgsCount(name, args.length);
            transaction.queue(`function ${name}(${args.join(',')}) {\n`);
            transaction.indent();
        }
        const body = m(lexer.braces(p.many(statement)));
        if (m.success) {
            body.forEach(t => {
                transaction.append(t);
            });
            transaction.dedent();
            transaction.queue(`}\n`);
            return transaction.get();
        }
    }));
    const expressionStatement = p.fmap(expr => expr + ';\n', p.head(expression, lexer.semi));
    const varExpression = p.seq(m => {
        m(lexer.reserved('var'));
        const name = m(lexer.identifier);
        m(lexer.symbol('='));
        const expr = m(expression);
        return `var ${name} = ${expr}`;
    });
    const varStatement = p.seq(m => {
        const expr = m(varExpression);
        m(lexer.semi);
        return printer.get(expr + ';\n');
    });
    const ifStatement = p.seq(m => {
        m(lexer.reserved('if'));
        const condition = m(lexer.parens(expression));
        const thenClause = m(blockStatement);
        const elseClause = m(p.option(p.seq(x => {
            x(lexer.reserved('else'));
            return ' else ' + x(p.or(blockStatement, ifStatement));
        }), ''));
        return `if(${condition}) ` + thenClause + elseClause + '\n';
    });
    const forStatement = p.seq(m => {
        m(lexer.reserved('for'));
        const head = m(lexer.parens(p.seq(s => {
            const init = s(p.option(p.or(varExpression, expression), ''));
            s(lexer.semi);
            const condition = s(expression);
            s(lexer.semi);
            const next = s(expression);
            return `(${init}; ${condition}; ${next}) `;
        })));
        const body = m(blockStatement);
        return printer.get('for' + head + body + '\n');
    });
    const returnStatement = p.fmap(expr => printer.get(`return ${expr};\n`), p.between(lexer.reserved('return'), expression, lexer.semi));
    /**
     * Enhance parser with scope
     *
     * Push scope when parsing start.
     * Pop scope when parsing end.
     *
     * @param parser
     */
    function makeScopeParser(parser) {
        return p.seq(m => {
            m._userState.scope.advance(1);
            const sts = m(parser);
            m._userState.scope.back(1);
            return sts;
        });
    }
    const statement = p.or(functionStatement, returnStatement, ifStatement, forStatement, varStatement, expressionStatement);
    const blockStatement = makeScopeParser(p.or(p.fmap(xs => `{\n${xs.join('')}}`, lexer.braces(p.seq(s => {
        printer.indent();
        const sts = s(p.many(statement));
        printer.dedent();
        return sts;
    }))), expression));
    const topLevelStatements = p.or(operatorStatement, functionStatement, ifStatement, forStatement, varStatement, expressionStatement);
    const script = makeScopeParser(p.between(lexer.whiteSpaceOrComment, p.fmap(xs => xs.join(''), p.many(topLevelStatements)), p.eof));
    return p.parse(script, new p.State(source, 0, { scope: new Scope() }));
}
exports.compile = compile;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTokenParser = exports.buildExpressionParser = exports.OperatorTable = exports.Postfix = exports.Prefix = exports.NoneAssoc = exports.RightAssoc = exports.LeftAssoc = exports.Assoc = exports.hexDigit = exports.octDigit = exports.digit = exports.letter = exports.alphaNum = exports.lower = exports.upper = exports.tab = exports.newLine = exports.spaces = exports.space = exports.anyChar = exports.string = exports.range = exports.regexp = exports.charCode = exports.char = exports.noneOf = exports.oneOf = exports.Join = exports.until = exports.satisfy = exports.label = exports.lazy = exports.notFollowedBy = exports.lookAhead = exports.skipMany1 = exports.skipMany = exports.optional = exports.option = exports.pure = exports.fmap = exports.endBy = exports.endBy1 = exports.endByN = exports.sepBy = exports.sepBy1 = exports.sepByN = exports.between = exports.seq = exports.head = exports.series = exports.array = exports.many1 = exports.many = exports.count = exports.repeat = exports.or = exports.choice = exports.triable = exports.unexpected = exports.fail = exports.eof = exports.empty = void 0;
const State_1 = __webpack_require__(0);
__exportStar(__webpack_require__(0), exports);
exports.empty = new State_1.Parser((state) => State_1.ok(state, undefined));
exports.eof = new State_1.Parser((state) => state.position === state.source.length ? State_1.ok(state.seek(1), undefined) : State_1.error(state, () => 'end of file'));
function fail(message) {
    return new State_1.Parser((state) => State_1.error(state, () => 'failed: ' + message));
}
exports.fail = fail;
function unexpected(message) {
    return new State_1.Parser((state) => State_1.error(state, () => 'unexpected: ' + message));
}
exports.unexpected = unexpected;
/**
 * `try` in haskell
 *
 * @param p
 */
function triable(p) {
    function tryParser(s) {
        const st = State_1.parse(p, s);
        return st.success ? st : State_1.error(s, st.expected);
    }
    return new State_1.Parser(tryParser);
}
exports.triable = triable;
/**
 * `<|>` operator in haskell
 *
 * @param ps
 */
function choice(ps) {
    function choiceParser(state) {
        const errorSts = [];
        for (let i = 0; i < ps.length; i++) {
            const st = State_1.parse(ps[i], state);
            if (st.success) {
                return st;
            }
            errorSts.push(st);
        }
        return State_1.error(state, () => 'one of ' + errorSts.map(st => st.expected()).join(', '));
    }
    return new State_1.Parser(choiceParser);
}
exports.choice = choice;
/**
 * Variable parameter version of `choice`
 * @see choice
 * @param ps
 */
function or(...ps) {
    return choice(ps);
}
exports.or = or;
/**
 * parses `n` occurrences of `p` at minimum, parses `m` occurrences of `p` at maximum.
 *
 * @param min
 * @param max
 * @param p
 */
function repeat(min, max, p) {
    function repeatParser(s) {
        const xs = [];
        let st = State_1.ok(s, undefined);
        for (let i = 0; i < max; i++) {
            const _st = State_1.parse(p, st.state);
            if (_st.success) {
                st = _st;
                xs.push(st.value);
            }
            else if (st.state.position < _st.state.position) {
                // ensure do not consume any char when p parsing failed
                return State_1.error(_st.state, _st.expected);
            }
            else if (i < min) {
                return State_1.error(_st.state, _st.expected);
            }
            else {
                break;
            }
        }
        return State_1.ok(st.state, xs);
    }
    return new State_1.Parser(repeatParser);
}
exports.repeat = repeat;
function count(n, p) {
    return repeat(n, n, p);
}
exports.count = count;
function many(p) {
    return repeat(0, Number.MAX_VALUE, p);
}
exports.many = many;
/**
 * @haskell Text.ParserCombinators.Parsec.many1
 * @param p
 */
function many1(p) {
    return repeat(1, Number.MAX_VALUE, p);
}
exports.many1 = many1;
function array(ps) {
    function arrayParser(s) {
        const values = [];
        let st = State_1.ok(s);
        for (let i = 0; i < ps.length; i++) {
            st = State_1.parse(ps[i], s);
            if (!st.success)
                return State_1.error(st.state, st.expected);
            values.push(st.value);
        }
        return State_1.ok(st.state, values);
    }
    return new State_1.Parser(arrayParser);
}
exports.array = array;
function series(...ps) {
    return array(ps);
}
exports.series = series;
/**
 * (a, b, c, d, ...etc) parses all of them, and returns reply of `a`
 * If one of them fails, the rest will be ignore.
 *
 * @param p
 * @param ps
 * @return parser Parser<T>
 */
function head(p, ...ps) {
    function headParser(s) {
        let st = State_1.parse(p, s);
        const value = st.value;
        for (let i = 0; i < ps.length && st.success; i++) {
            st = State_1.parse(ps[i], st.state);
        }
        return st.success ? State_1.ok(st.state, value) : st;
    }
    return new State_1.Parser(headParser);
}
exports.head = head;
/**
 * Parser control flow (Simulating `do` operator in haskell)
 *
 * If apply parser `p` succeed, p return the parsed value. Otherwise return undefined
 * If parsed failed, the parser `p` will be ignored and return undefined
 *
 * <pre>
 *   p.seq(m => {
 *     m(p.string('abcdef'));
 *     m(p.string('gh'));
 *     return 123;
 *   })
 * </pre>
 *
 * The input is "abcdefgh", first and second all parsed succeed.
 * Seq parser return 123 which meaning the state.value is 123.
 *
 * <pre>
 *   p.seq(m => {
 *     m(p.string('1abcdef'));
 *     m(p.string('abc'));
 *   })
 * </pre>
 *
 * The input is "abcdefgh", the first parsed failed, the second parsed will be ignore.
 *
 * @param f
 */
function seq(f) {
    function seqParser(s) {
        let st = State_1.ok(s, undefined);
        const m = (p) => {
            if (st.success) {
                st = State_1.parse(p, st.state);
                m.success = st.success;
                m.state = st.state;
                return st.value;
            }
        };
        m.success = true;
        m.state = st.state;
        m._userState = st.state._userState;
        const value = f(m);
        st.state._userState = m._userState;
        return st.success ? State_1.ok(st.state, value) : st;
    }
    return new State_1.Parser(seqParser);
}
exports.seq = seq;
function between(open, p, close) {
    return seq(m => {
        m(open);
        const x = m(p);
        m(close);
        return x;
    });
}
exports.between = between;
/**
 *
 * @param min parses `min` or more occurrences of p
 * @param max parses `max` or less occurrences of p
 * @param p
 * @param sep
 * @return parser Parser<T[]>
 */
function sepByN(min, max, p, sep) {
    function sepByNParser(s) {
        let st = State_1.ok(s);
        const xs = [];
        let _st = State_1.parse(p, st.state);
        if (_st.success) {
            st = _st;
            xs.push(_st.value);
            for (let i = 1; i < max; i++) {
                const sepSt = State_1.parse(sep, st.state);
                if (sepSt.success) {
                    st = State_1.parse(p, sepSt.state);
                    if (st.success) {
                        xs.push(st.value);
                        continue;
                    }
                }
                else if (xs.length < min) {
                    return State_1.error(_st.state, _st.expected);
                }
                break;
            }
        }
        else if (xs.length < min) {
            return State_1.error(_st.state, _st.expected);
        }
        return st.success ? State_1.ok(st.state, xs) : State_1.error(st.state, st.expected);
    }
    return new State_1.Parser(sepByNParser);
}
exports.sepByN = sepByN;
function sepBy1(p, sep) {
    return sepByN(1, Number.MAX_VALUE, p, sep);
}
exports.sepBy1 = sepBy1;
function sepBy(p, sep) {
    return sepByN(0, Number.MAX_VALUE, p, sep);
}
exports.sepBy = sepBy;
/**
 *
 * @param min
 * @param max
 * @param p
 * @param sep
 */
function endByN(min, max, p, sep) {
    return repeat(min, max, head(p, sep));
}
exports.endByN = endByN;
/**
 * p sep parses one or more occurrences of p, separated and ended by sep. Returns a list of values returned by p.
 *
 * @param p
 * @param sep
 * @return Parser<T[]>
 */
function endBy1(p, sep) {
    return endByN(1, Number.MAX_VALUE, p, sep);
}
exports.endBy1 = endBy1;
/**
 * p sep parses zero or more occurrences of p, separated and ended by sep. Returns a list of values returned by p.
 *
 * @param p
 * @param sep
 * @return Parser<T[]>
 */
function endBy(p, sep) {
    return endByN(0, Number.MAX_VALUE, p, sep);
}
exports.endBy = endBy;
/**
 * a -> b -> f a -> f b
 * @param f
 * @param p
 */
function fmap(f, p) {
    function mapParser(s) {
        const st = State_1.parse(p, s);
        return st.success ? State_1.ok(st.state, f(st.value)) : State_1.error(st.state, st.expected);
    }
    return new State_1.Parser(mapParser);
}
exports.fmap = fmap;
/**
 * Lift a value (id)
 *
 * T -> Parser<T>
 *
 * @haskell Applicative pure
 * @param v {T}
 * @return Parser<T>
 */
function pure(v) {
    return fmap(() => v, exports.empty);
}
exports.pure = pure;
/**
 * If `p` parsed succeed, return the parsed value. Otherwise return defaultValue.
 *
 * @param p
 * @param defaultValue
 */
function option(p, defaultValue) {
    return or(p, pure(defaultValue));
}
exports.option = option;
/**
 * Same as @option@ but if `p` parsed failed, return undefined.
 *
 * @param p
 */
function optional(p) {
    return option(p, undefined);
}
exports.optional = optional;
/**
 * Skip character parsed by `p` until `p` parsing failed.
 *
 * @param p
 */
function skipMany(p) {
    return fmap((xs) => undefined, many(p));
}
exports.skipMany = skipMany;
/**
 * Same as skipMany but parsing p succeed at least once.
 *
 * @param p
 */
function skipMany1(p) {
    return seq(m => {
        m(p);
        m(skipMany(p));
    });
}
exports.skipMany1 = skipMany1;
function lookAhead(p) {
    function lookAheadParser(state) {
        const st = State_1.parse(p, state);
        return st.success ? State_1.ok(state, st.value) : st;
    }
    return new State_1.Parser(lookAheadParser);
}
exports.lookAhead = lookAhead;
/**
 * Regardless of parsing success or failure, it never consume any char.
 *
 * @param p
 */
function notFollowedBy(p) {
    function notFollowedByParser(state) {
        const st = State_1.parse(p, state);
        return st.success ? State_1.error(state, () => 'not ' + st.value) : State_1.ok(state, undefined);
    }
    return new State_1.Parser(notFollowedByParser);
}
exports.notFollowedBy = notFollowedBy;
function lazy(f) {
    function lazyParser(state) {
        return State_1.parse(f(), state);
    }
    return new State_1.Parser(lazyParser);
}
exports.lazy = lazy;
/**
 * `<?>` operator in haskell
 *
 * @param message
 * @param p
 */
function label(message, p) {
    function labelParser(state) {
        const st = State_1.parse(p, state);
        return st.success || st.state.position !== state.position ? st : State_1.error(state, () => message);
    }
    return new State_1.Parser(labelParser);
}
exports.label = label;
function satisfy(cond) {
    function satisfyChars() {
        const xs = [];
        for (let i = 32; i <= 126; i++) {
            const char = String.fromCharCode(i);
            if (cond(char, i)) {
                xs.push(char);
            }
        }
        return xs;
    }
    function satisfyParser(state) {
        if (state.position < state.source.length) {
            const char = state.source[state.position];
            const code = state.source.charCodeAt(state.position);
            if (cond(char, code)) {
                return State_1.ok(state.seek(1), char);
            }
        }
        return State_1.error(state, () => {
            const xs = satisfyChars();
            return `one of "${xs.join('')}"`;
        });
    }
    return new State_1.Parser(satisfyParser);
}
exports.satisfy = satisfy;
function until(p) {
    function untilParser(state) {
        if (state.position <= state.source.length) {
            for (let i = state.position; i < state.source.length; i++) {
                const st = State_1.parse(p, new State_1.State(state.source.slice(i)));
                if (st.success) {
                    return State_1.ok(state.seek(i - state.position), state.source.slice(state.position, i));
                }
            }
        }
        return State_1.error(state.seek(state.source.length - state.position), () => `can not match until the end`);
    }
    return new State_1.Parser(untilParser);
}
exports.until = until;
exports.Join = {
    many: (p) => fmap(x => x.join(''), many(p)),
    many1: (p) => fmap(x => x.join(''), many1(p)),
    sepBy1: (p, sep) => fmap(x => x.join(''), sepBy1(p, sep)),
    array: (ps) => fmap(x => x.join(''), array(ps)),
    series: (...ps) => fmap(x => x.join(''), series(...ps)),
};
function oneOf(chars) {
    return satisfy((c, _) => chars.indexOf(c) >= 0);
}
exports.oneOf = oneOf;
function noneOf(chars) {
    return satisfy((c, _) => chars.indexOf(c) === -1);
}
exports.noneOf = noneOf;
function char(c) {
    return satisfy(char => char === c);
}
exports.char = char;
function charCode(cc) {
    return satisfy((_, char) => char === cc);
}
exports.charCode = charCode;
function regexp(re) {
    function regexpParser(state) {
        if (state.position < state.source.length) {
            const input = state.source.slice(state.position);
            const ms = input.match(re);
            if (ms && ms.index === 0 && ms.length > 0) {
                const m = ms[0];
                return input.indexOf(m) === 0 ? State_1.ok(state.seek(m.length), m) : State_1.error(state, () => '/' + re + '/');
            }
        }
        return State_1.error(state, () => '' + re);
    }
    return new State_1.Parser(regexpParser);
}
exports.regexp = regexp;
function range(min, max) {
    if (typeof min === 'string') {
        min = min.charCodeAt(0);
    }
    if (typeof max === 'string') {
        max = max.charCodeAt(0);
    }
    return satisfy((_, code) => code >= min && code <= max);
}
exports.range = range;
/**
 * string parser
 *
 * @param text string
 * @param caseSensitive boolean
 * @return Parser<string>
 */
function string(text, caseSensitive = true) {
    text = caseSensitive ? text : text.toLowerCase();
    function stringParser(s) {
        const slice = s.source.slice(s.position, s.position + text.length);
        return text === (caseSensitive ? slice : slice.toLowerCase())
            ? State_1.ok(s.seek(text.length), text)
            : State_1.error(s, () => '"' + text + '"');
    }
    return new State_1.Parser(stringParser);
}
exports.string = string;
exports.anyChar = satisfy(_ => true);
exports.space = oneOf('\t\r\n');
exports.spaces = fmap(xs => xs.join(), many(exports.space));
exports.newLine = oneOf('\r\n');
exports.tab = char('\t');
exports.upper = oneOf('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
exports.lower = oneOf('abcdefghijklmnopqrstuvwxyz');
exports.alphaNum = oneOf('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
exports.letter = oneOf('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
exports.digit = oneOf('0123456789');
exports.octDigit = oneOf('01234567');
exports.hexDigit = oneOf('0123456789abcdefghABCDEFGH');
/**
 * @haskell Text.Parsec.Expr
 */
var Assoc;
(function (Assoc) {
    Assoc[Assoc["AssocNone"] = 0] = "AssocNone";
    Assoc[Assoc["AssocLeft"] = 1] = "AssocLeft";
    Assoc[Assoc["AssocRight"] = 2] = "AssocRight";
})(Assoc = exports.Assoc || (exports.Assoc = {}));
class LeftAssoc {
    constructor(p) {
        this.p = p;
    }
}
exports.LeftAssoc = LeftAssoc;
class RightAssoc {
    constructor(p) {
        this.p = p;
    }
}
exports.RightAssoc = RightAssoc;
class NoneAssoc {
    constructor(p) {
        this.p = p;
    }
}
exports.NoneAssoc = NoneAssoc;
class Prefix {
    constructor(p) {
        this.p = p;
    }
}
exports.Prefix = Prefix;
class Postfix {
    constructor(p) {
        this.p = p;
    }
}
exports.Postfix = Postfix;
class OperatorTable {
    constructor(infixr = [], infixl = [], infix = [], prefix = [], postfix = []) {
        this.infixr = infixr;
        this.infixl = infixl;
        this.infix = infix;
        this.prefix = prefix;
        this.postfix = postfix;
    }
}
exports.OperatorTable = OperatorTable;
/**
 * @see https://hackage.haskell.org/package/parsec-3.1.14.0/docs/src/Text.Parsec.Expr.html#buildExpressionParser
 *
 * @param operators
 * @param simpleExpr
 */
function buildExpressionParser(operators, simpleExpr) {
    function makeParser(term, ops) {
        const rassocOp = choice(ops.infixr);
        const lassocOp = choice(ops.infixl);
        const nassocOp = choice(ops.infix);
        const prefixOp = choice(ops.prefix);
        const postfixOp = choice(ops.postfix);
        function ambiguous(assoc, op) {
            return triable(seq(m => {
                m(op);
                return m(fail(`ambiguous use of a ${assoc} associative operator`));
            }));
        }
        const ambiguousRight = ambiguous('right', rassocOp);
        const ambiguousLeft = ambiguous('left', lassocOp);
        const ambiguousNon = ambiguous('non', nassocOp);
        const postfixP = or(postfixOp, pure((x) => x));
        const prefixP = or(prefixOp, pure((x) => x));
        function rassocP1(x) {
            return or(rassocP(x), pure(x));
        }
        function lassocP1(x) {
            return or(lassocP(x), pure(x));
        }
        function rassocP(x) {
            return or(seq(m => {
                const f = m(rassocOp);
                const y = m(seq(s => {
                    const z = s(termP);
                    return s(rassocP1(z));
                }));
                if (m.success) {
                    return f(x, y);
                }
            }), ambiguousLeft, ambiguousNon);
        }
        function lassocP(x) {
            return or(seq(m => {
                const f = m(lassocOp);
                const y = m(termP);
                if (m.success) {
                    return m(lassocP1(f(x, y)));
                }
            }), ambiguousRight, ambiguousNon);
        }
        const termP = seq(m => {
            const pre = m(prefixP);
            const x = m(term);
            const post = m(postfixP);
            if (m.success) {
                return post(pre(x));
            }
        });
        function nassocP(x) {
            return seq(m => {
                const f = m(nassocOp);
                const y = m(termP);
                if (m.success) {
                    return m(or(ambiguousRight, ambiguousLeft, ambiguousNon, pure(f(x, y))));
                }
            });
        }
        return seq(m => {
            const x = m(termP);
            if (m.success) {
                return m(label('operator', or(rassocP(x), lassocP(x), nassocP(x), pure(x))));
            }
        });
    }
    return operators.reduce(makeParser, simpleExpr);
}
exports.buildExpressionParser = buildExpressionParser;
function buildTokenParser(lang) {
    const whiteSpace = skipMany1(oneOf(' \n\t\r'));
    const multiCommentStart = triable(lang.multiCommentStart);
    const multiCommentEnd = triable(lang.multiCommentEnd);
    const singleLineComment = label('end of single line comment', seq(m => {
        m(lang.singleCommentLine);
        return m(until(string('\n')));
    }));
    const multiLineComment = seq(m => {
        m(multiCommentStart);
        const xs = m(until(multiCommentEnd));
        m(multiCommentEnd);
        return m(pure(xs));
    });
    const whiteSpaceOrComment = skipMany(or(whiteSpace, fmap(_ => undefined, multiLineComment), fmap(_ => undefined, singleLineComment)));
    function lexeme(p) {
        return seq(m => {
            const x = m(p);
            m(whiteSpaceOrComment);
            return x;
        });
    }
    function symbol(name) {
        return lexeme(string(name));
    }
    const semi = symbol(';');
    const comma = symbol(',');
    const dot = symbol('.');
    const colon = symbol(':');
    const oper = seq(m => {
        const o = m(lang.opStart);
        const os = m(exports.Join.many(lang.opLetter));
        return o + os;
    });
    function isReservedOp(name) {
        return lang.reservedOps.indexOf(name) > -1;
    }
    const operator = lexeme(triable(seq(m => {
        const name = m(oper);
        return isReservedOp(name) ? m(unexpected(`reserved operator ${name}`)) : name;
    })));
    function reserved(name) {
        // Use lexeme to consume whiteSpace or comments after reserved word.
        return lexeme(triable(seq(m => {
            const n = m(string(name, lang.caseSensitive));
            m(notFollowedBy(lang.identifierLetter));
            return n;
        })));
    }
    function reservedOp(name) {
        return lexeme(triable(seq(m => {
            const n = m(string(name));
            m(notFollowedBy(lang.opLetter));
            return n;
        })));
    }
    function isReservedName(name) {
        const rns = lang.caseSensitive ? lang.reservedNames : lang.reservedNames.map(x => x.toLowerCase());
        const cn = lang.caseSensitive ? name : name.toLowerCase();
        return rns.indexOf(cn) > -1;
    }
    const uncheckIdentifier = seq(m => {
        const s = m(lang.identifierStart);
        const sx = m(exports.Join.many(lang.identifierLetter));
        return m.success && s + sx;
    });
    const identifier = lexeme(triable(seq(m => {
        const ident = m(uncheckIdentifier);
        if (!ident || isReservedName(ident)) {
            return m(unexpected(`${ident} is reserved word`));
        }
        else {
            return ident;
        }
    })));
    // ()
    function parens(p) {
        return between(symbol('('), p, symbol(')'));
    }
    // {}
    function braces(p) {
        return between(symbol('{'), p, symbol('}'));
    }
    // <>
    function angles(p) {
        return between(symbol('<'), p, symbol('>'));
    }
    // []
    function brackets(p) {
        return between(symbol('['), p, symbol(']'));
    }
    const escapeCode = seq(m => {
        const x = m(exports.anyChar);
        switch (x) {
            case 'r':
                return '\\r';
            case 'n':
                return '\\n';
            case '\\':
                return '\\\\';
            case '"':
                return m(unexpected(x));
            default:
                return x;
        }
    });
    const escape = seq(m => {
        m(string('\\'));
        return m(escapeCode);
    });
    function makeCharLetter(quote) {
        return satisfy((char, code) => code >= 32 && char !== quote && char !== '\\');
    }
    const charLetter = makeCharLetter("'");
    const charLiteral = label('charLiteral', lexeme(between(string("'"), or(charLetter, escape), string("'"))));
    const stringLetter = makeCharLetter('"');
    const stringLiteral = label('stringLiteral', lexeme(fmap(xs => xs.join(''), between(string('"'), many(or(stringLetter, escape)), string('"')))));
    function number(radix, digit) {
        return fmap(xs => xs.reduce((x, d) => x * radix + parseInt(d), 0), many1(digit));
    }
    const decimal = number(10, exports.digit);
    const hexadecimal = seq(m => {
        m(oneOf('xX'));
        return m(number(16, exports.hexDigit));
    });
    const octal = seq(m => {
        m(oneOf('oO'));
        return m(number(8, exports.octDigit));
    });
    const zeroNumber = seq(m => {
        m(string('0'));
        return m(or(decimal, hexadecimal, octal, pure(0)));
    });
    const nat = or(zeroNumber, decimal);
    // Return a function which accept a natural number and return typed number.
    const sign = or(seq(m => {
        m(string('-'));
        return m(pure((x) => -x));
    }), seq(m => {
        m(string('+'));
        return m(pure((x) => x));
    }), pure((x) => x));
    const int = seq(m => {
        const f = m(lexeme(sign));
        const x = m(nat);
        return m.success ? f(x) : undefined;
    });
    const exponent = label('exponent', seq(m => {
        function power(e) {
            return e < 0 ? 1.0 / power(-e) : Math.pow(10, e);
        }
        m(oneOf('eE'));
        const f = m(sign);
        const n = m(decimal);
        return m.success ? power(f(n)) : undefined;
    }));
    const fraction = label('fraction', seq(m => {
        function fract(digits) {
            return parseFloat('0.' + digits.reduce((s, x) => s + x, ''));
        }
        m(string('.'));
        const digits = m(many1(exports.digit));
        return m.success ? fract(digits) : undefined;
    }));
    function fractExponent(n) {
        return or(
        // With fraction
        seq(m => {
            const fract = m(fraction);
            const exponent$ = m(option(exponent, 1.0));
            return m.success ? (n + fract) * exponent$ : undefined;
        }), 
        // Integral
        seq(m => {
            const exponent$ = m(exponent);
            return m.success ? n * exponent$ : undefined;
        }));
    }
    const floating = seq(m => {
        const n = m(decimal);
        return m(fractExponent(n));
    });
    const decimalFloat = seq(m => {
        const n = m(decimal);
        return m(option(fractExponent(n), n));
    });
    const zeroNumFloat = or(or(hexadecimal, octal), decimalFloat, fractExponent(0), pure(0));
    const naturalFloat = or(seq(m => {
        m(string('0'));
        return m(zeroNumFloat);
    }), decimalFloat);
    const naturalOrFloat = lexeme(naturalFloat);
    const float = lexeme(floating);
    const integer = lexeme(int);
    const natural = lexeme(nat);
    return {
        identifier,
        reservedOp,
        reserved,
        operator,
        charLiteral,
        stringLiteral,
        natural,
        integer,
        float,
        naturalOrFloat,
        decimal,
        hexadecimal,
        octal,
        symbol,
        lexeme,
        whiteSpace,
        whiteSpaceOrComment,
        multiLineComment,
        singleLineComment,
        parens,
        braces,
        angles,
        brackets,
        semi,
        comma,
        colon,
        dot,
    };
}
exports.buildTokenParser = buildTokenParser;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Lodash.repeat
 * @param string
 * @param n
 */
function repeat(string, n) {
    let result = '';
    if (!string || n < 1 || n > Number.MAX_SAFE_INTEGER) {
        return result;
    }
    do {
        if (n % 2) {
            result += string;
        }
        n = Math.floor(n / 2);
        if (n) {
            string += string;
        }
    } while (n);
    return result;
}
class Printer {
    constructor(options) {
        this._indent = 0;
        this._options = options || {
            indent: '  ',
        };
    }
    indent() {
        this._indent++;
    }
    dedent() {
        this._indent--;
    }
    _getIndent() {
        return repeat(this._options.indent, this._indent);
    }
    get(str) {
        return this._getIndent() + str;
    }
    transaction() {
        let _buf = [];
        return {
            queue: (str) => {
                _buf.push(this._getIndent());
                _buf.push(str);
            },
            append: (str) => {
                _buf.push(str);
            },
            get: () => {
                return _buf.join('');
            },
            rollback: () => {
                _buf = [];
            },
            indent: () => this.indent(),
            dedent: () => this.dedent(),
        };
    }
}
exports.default = Printer;


/***/ })
/******/ ]);
});
//# sourceMappingURL=core.js.map