import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  TextNode
} from "lexical";

import { SpoilerNode } from "../../nodes/SpoilerNode";

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [TextNode, SpoilerNode];
