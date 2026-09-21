import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  TextNode
} from "lexical";

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [TextNode];
