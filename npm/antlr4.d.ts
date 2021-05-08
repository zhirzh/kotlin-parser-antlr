declare module 'antlr4' {
  export class InputStream {
    constructor(data: string)
  }

  export class CommonTokenStream {
    constructor(lexer: any)
  }

  export class ParserRuleContext {
    children: null | ParseTree[]
    start: Token
    stop: Token
  }

  export var tree: {
    RuleNode: typeof RuleNode
    ErrorNode: typeof ErrorNode
    TerminalNode: typeof TerminalNode
  }

  class RuleNode extends ParseTree {}
  class ErrorNode extends TerminalNode {}
  class TerminalNode extends ParseTree {
    symbol: Token
  }
  class ParseTree {}

  class Token {
    type: number
    start: number
    stop: number
    line: number
    column: number
    text: string
  }
}
