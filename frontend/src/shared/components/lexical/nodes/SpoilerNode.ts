import {
  $unwrapMarkNode,
  $wrapSelectionInMarkNode,
  MarkNode,
  type SerializedMarkNode,
} from "@lexical/mark";
import { $findMatchingParent } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type RangeSelection,
} from "lexical";

const SPOILER_ID = "spoiler";

/**
 * Спойлер — inline-обёртка над куском текста. Наследуемся от MarkNode:
 * у него уже есть корректное оборачивание выделения ($wrapSelectionInMarkNode)
 * и снятие обёртки ($unwrapMarkNode). Внутри может быть любое форматирование.
 *
 * В JSON: { type: "spoiler", ids: ["spoiler"], children: [...] }.
 * В режиме чтения скрыт до нажатия (стили — editor-theme.css, .Spoiler).
 */
export class SpoilerNode extends MarkNode {
  static getType(): string {
    return "spoiler";
  }

  static clone(node: SpoilerNode): SpoilerNode {
    return new SpoilerNode(node.__ids, node.__key);
  }

  static importJSON(serialized: SerializedMarkNode): SpoilerNode {
    return $createSpoilerNode().updateFromJSON(serialized);
  }

  constructor(ids: readonly string[] = [SPOILER_ID], key?: NodeKey) {
    super(ids, key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const el = document.createElement("span");
    el.className = config.theme.spoiler ?? "Spoiler";
    el.dataset.spoiler = "";
    return el;
  }

  updateDOM(): boolean {
    return false;
  }

  // MarkNode создал бы здесь обычный MarkNode, который не зарегистрирован.
  insertNewAfter(_selection: RangeSelection, restoreSelection = true) {
    const node = $createSpoilerNode();
    this.insertAfter(node, restoreSelection);
    return node;
  }
}

export const $createSpoilerNode = () => new SpoilerNode();

export const $isSpoilerNode = (node: LexicalNode | null | undefined): node is SpoilerNode =>
  node instanceof SpoilerNode;

const $spoilersInSelection = (sel: RangeSelection) => {
  const found = new Map<NodeKey, SpoilerNode>();
  for (const node of [sel.anchor.getNode(), sel.focus.getNode(), ...sel.getNodes()]) {
    const spoiler = $isSpoilerNode(node) ? node : $findMatchingParent(node, $isSpoilerNode);
    if (spoiler) found.set(spoiler.getKey(), spoiler);
  }
  return [...found.values()];
};

/** Курсор/выделение внутри спойлера — для подсветки кнопки в тулбаре. */
export const $isSelectionInSpoiler = () => {
  const sel = $getSelection();
  return $isRangeSelection(sel) && $spoilersInSelection(sel).length > 0;
};

/**
 * Переключить спойлер: если выделение задевает спойлер — снять его,
 * иначе обернуть выделенный текст. Возвращает false, если выделять нечего.
 */
export const toggleSpoiler = (editor: LexicalEditor) => {
  let applied = true;
  editor.update(() => {
    const sel = $getSelection();
    if (!$isRangeSelection(sel)) return;

    const spoilers = $spoilersInSelection(sel);
    if (spoilers.length) {
      spoilers.forEach($unwrapMarkNode);
      return;
    }
    if (sel.isCollapsed()) {
      applied = false;
      return;
    }
    $wrapSelectionInMarkNode(sel, sel.isBackward(), SPOILER_ID, () => $createSpoilerNode());
  });
  return applied;
};
