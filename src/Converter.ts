import { ParserRuleContext, ParseTree, TerminalNode, Token, tree } from 'antlr4'
import KotlinLexer from './kotlin/KotlinLexer'
import { BaseNode, BranchNode, ConverterOptions, LeafNode, Location, Position } from './types'

const LexerKeys = Object.keys(KotlinLexer) as Array<keyof typeof KotlinLexer>

export default class Converter {
  private simplifyTree?: boolean

  constructor(options?: ConverterOptions) {
    this.simplifyTree = options?.simplifyTree
  }

  visit(ctx: ParseTree): null | string | BranchNode | LeafNode {
    if (ctx instanceof tree.TerminalNode) {
      return this.visitTerminal(ctx)
    }

    if (!(ctx instanceof ParserRuleContext) || !Array.isArray(ctx.children)) {
      return null
    }

    const children = ctx.children.map(child => this.visit(child)).filter(isNotNull)

    if (children.length === 0) {
      return null
    }

    const startToken = ctx.start
    const stopToken = ctx.stop

    const node: BaseNode = {
      type: ctx.constructor.name.replace(/Context$/, ''),
      location: getTokenLocation(startToken, stopToken),
    }

    let text: string | undefined
    if (children.length === 1) {
      const first = children[0]

      if (typeof first === 'string') {
        text = first
      } else if (this.simplifyTree) {
        return first
      }
    }

    if (text) {
      const leafNode = node as LeafNode
      leafNode.text = text
      return leafNode
    }

    const branchNode = node as BranchNode
    branchNode.children = children
    return branchNode
  }

  visitTerminal(node: TerminalNode): null | string | LeafNode {
    const { symbol } = node

    switch (symbol.type) {
      case KotlinLexer.NL:
      case KotlinLexer.EOF:
        return null

      case KotlinLexer.Identifier:
        return symbol.text
    }

    return {
      type: LexerKeys.find(k => KotlinLexer[k] === symbol.type)!!,
      location: getTokenLocation(symbol),
      text: symbol.text,
    }
  }
}

const isNotNull = <T>(x: T | null): x is T => x !== null

const getTokenLocation = (startToken: Token, stopToken: Token = startToken): Location => ({
  start: getTokenStartPosition(startToken),
  stop: getTokenStopPosition(stopToken),
})

const getTokenStartPosition = (token: Token): Position => ({
  line: token.line,
  col: token.column + 1,
  offset: token.start,
})

const getTokenStopPosition = (token: Token): Position => ({
  line: token.line,
  col: token.column + 1,
  offset: token.stop,
})
