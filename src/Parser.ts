import { CommonTokenStream, InputStream } from 'antlr4'
import Converter from './Converter'
import KotlinLexer from './kotlin/KotlinLexer'
import KotlinParser from './kotlin/KotlinParser'
import { BranchNode, ConverterOptions, LeafNode } from './types'

export default class Parser {
  parse(code: string, options?: ConverterOptions): null | string | BranchNode | LeafNode {
    const input = new InputStream(code)
    const lexer = new KotlinLexer(input)
    const tokens = new CommonTokenStream(lexer)
    const parser = new KotlinParser(tokens)
    const converter = new Converter(options)
    const tree = converter.visit(parser.kotlinFile())
    return tree
  }
}
