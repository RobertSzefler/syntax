/**
 * LL(1) parser generated by the Syntax tool.
 *
 * https://www.npmjs.com/package/syntax-cli
 *
 *   npm install -g syntax-cli
 *
 *   syntax-cli --help
 *
 * To regenerate run:
 *
 *   syntax-cli \
 *     --grammar ~/path-to-grammar-file \
 *     --mode LL1 \
 *     --output ~/path-to-output-parser-file.js
 */

'use strict';

let yytext;
let yyleng;
let __;

const EOF = '$';

const ps = <<PRODUCTIONS>>;
const tks = <<TOKENS>>;
const tbl = <<TABLE>>;

const s = [];

let tokenizer;
<<TOKENIZER>>

const yyparse = {
  parse(string) {
    yyparse.onParseBegin(string);

    if (!tokenizer) {
      throw new Error(`Tokenizer instance wasn't specified.`);
    }

    tokenizer.initString(string);

    s.length = 0;
    s.push(EOF, <<START>>);

    let t = tokenizer.getNextToken();
    let to = null;
    let tt = null;

    do {
      to = s.pop();
      tt = tks[t.type];

      if (to === tt) {
        t = tokenizer.getNextToken();
        continue;
      }

      der(to, t, tt);
    } while (tokenizer.hasMoreTokens() || s.length > 1);

    while (s.length !== 1) {
      der(s.pop(), t, tt);
    }

    if (s[0] !== EOF || t.value !== EOF) {
      parseError(`stack is not empty: ${s}, ${t.value}`);
    }

    return true;
  },

  setTokenizer(customTokenizer) {
    tokenizer = customTokenizer;
    return yyparse;
  },

  getTokenizer() {
    return tokenizer;
  },

  onParseBegin(string) {},
  onParseEnd(parsed) {},
};

<<MODULE_INCLUDE>>

function der(to, t, tt) {
  let npn = tbl[to][tt];
  if (!npn) {
    unexpectedToken(t);
  }
  s.push(...ps[npn][0]);
}

function unexpectedToken(token) {
  if (token.value === EOF) {
    unexpectedEndOfInput();
  }
  parseError(`Unexpected token: ${token.value}.`);
}

function unexpectedEndOfInput() {
  parseError(`Unexpected end of input.`);
}

function parseError(message) {
  throw new Error(`Parse error: ${message}`);
}

module.exports = yyparse;