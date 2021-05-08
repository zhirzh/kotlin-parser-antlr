export interface ConverterOptions {
  simplifyTree?: boolean
}

export interface Position {
  line: number
  col: number
  offset: number
}

export interface Location {
  start: Position
  stop: Position
}

export interface BaseNode {
  type: string
  location: Location
}

export interface BranchNode extends BaseNode {
  children: Array<string | BranchNode | LeafNode>
}

export interface LeafNode extends BaseNode {
  text: string
}
