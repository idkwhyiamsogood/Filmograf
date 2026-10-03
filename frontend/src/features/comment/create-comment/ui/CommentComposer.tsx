import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { ArrowUp, Bold, EyeOff, Italic, Strikethrough } from "lucide-react";
import { toast } from "sonner";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  FORMAT_TEXT_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  type LexicalEditor,
  type TextFormatType,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";

import { $isSelectionInSpoiler, editorTheme, nodes, toggleSpoiler } from "@/shared/components";
import { cn } from "@/shared/lib/utils";
import { Spinner } from "@/shared/ui/spinner";

export const COMMENT_MAX = 1000;

/** Текст комментария в бэке — сериализованный Lexical или обычная строка. */
const toEditorState = (text?: string) => {
  if (!text) return undefined;
  if (text.startsWith('{"root":')) return text;
  return JSON.stringify({
    root: {
      type: "root", version: 1, direction: "ltr", format: "", indent: 0,
      children: [{
        type: "paragraph", version: 1, direction: "ltr", format: "", indent: 0,
        children: [{ type: "text", version: 1, text, detail: 0, format: 0, mode: "normal", style: "" }],
      }],
    },
  });
};

/** Ctrl/⌘+Enter — отправить, Esc — отменить. */
const ShortcutsPlugin: FC<{ onSubmit: () => void; onCancel?: () => void }> = ({ onSubmit, onCancel }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(
    () =>
      mergeRegister(
        editor.registerCommand(
          KEY_ENTER_COMMAND,
          (e) => {
            if (e && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onSubmit();
              return true;
            }
            return false;
          },
          COMMAND_PRIORITY_HIGH,
        ),
        editor.registerCommand(
          KEY_ESCAPE_COMMAND,
          () => {
            if (!onCancel) return false;
            onCancel();
            return true;
          },
          COMMAND_PRIORITY_HIGH,
        ),
      ),
    [editor, onSubmit, onCancel],
  );
  return null;
};

const FORMATS: { type: TextFormatType; icon: typeof Bold; label: string }[] = [
  { type: "bold", icon: Bold, label: "Жирный" },
  { type: "italic", icon: Italic, label: "Курсив" },
  { type: "strikethrough", icon: Strikethrough, label: "Зачёркнутый" },
];

const toolButton = (active: boolean) =>
  cn(
    "flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors",
    active ? "bg-brand-soft text-primary" : "hover:bg-accent",
  );

const FormatButtons: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [inSpoiler, setInSpoiler] = useState(false);

  useEffect(
    () =>
      editor.registerUpdateListener(({ editorState }) =>
        editorState.read(() => {
          const sel = $getSelection();
          if (!$isRangeSelection(sel)) return;
          setActive(Object.fromEntries(FORMATS.map((f) => [f.type, sel.hasFormat(f.type)])));
          setInSpoiler($isSelectionInSpoiler());
        }),
      ),
    [editor],
  );

  const onSpoiler = () => {
    if (!toggleSpoiler(editor)) toast("Выделите текст, который нужно скрыть под спойлер");
  };

  // Узкий экран / глубокая ветка — кнопки форматирования прокручиваются,
  // а «Отправить» справа не уезжает за край.
  return (
    <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FORMATS.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          type="button"
          aria-label={label}
          aria-pressed={!!active[type]}
          // не забираем фокус у редактора
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, type)}
          className={toolButton(!!active[type])}
        >
          <Icon className="size-4" />
        </button>
      ))}
      <button
        type="button"
        aria-label="Спойлер"
        title="Спойлер"
        aria-pressed={inSpoiler}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onSpoiler}
        className={toolButton(inSpoiler)}
      >
        <EyeOff className="size-4" />
      </button>
    </div>
  );
};

interface Props {
  /** Отправка: вернуть Promise — при ошибке текст вернётся в поле */
  onSubmit: (text: string) => Promise<unknown> | void;
  onCancel?: () => void;
  initialText?: string;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  /** Компактный вид для ответа/правки внутри ветки */
  compact?: boolean;
}

export const CommentComposer: FC<Props> = ({
  onSubmit,
  onCancel,
  initialText,
  placeholder = "Поделитесь впечатлениями…",
  submitLabel = "Отправить",
  autoFocus,
  compact,
}) => {
  const editorRef = useRef<LexicalEditor | null>(null);
  const [length, setLength] = useState(0);
  const [focused, setFocused] = useState(Boolean(autoFocus));
  const [pending, setPending] = useState(false);

  const expanded = focused || length > 0 || Boolean(onCancel);
  const tooLong = length > COMMENT_MAX;
  const showCounter = length >= COMMENT_MAX * 0.8;
  const canSend = length > 0 && !tooLong && !pending;

  useEffect(() => {
    if (autoFocus) setTimeout(() => editorRef.current?.focus(), 50);
  }, [autoFocus]);

  const clear = () => editorRef.current?.update(() => $getRoot().clear());

  const send = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;
    const plain = editor.getEditorState().read(() => $getRoot().getTextContent().trim());
    if (!plain || plain.length > COMMENT_MAX) return;

    const serialized = JSON.stringify(editor.getEditorState().toJSON());
    // Оптимистично: поле очищаем сразу, комментарий уже в ленте.
    clear();
    setPending(true);
    try {
      await onSubmit(serialized);
    } catch {
      // Не потерять написанное, если отправка не удалась.
      editor.setEditorState(editor.parseEditorState(serialized));
    } finally {
      setPending(false);
    }
  }, [onSubmit]);

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "comment-composer",
        theme: editorTheme,
        nodes,
        editorState: toEditorState(initialText),
        onError: (e) => console.error(e),
      }}
    >
      <div
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
        }}
        className={cn(
          "rounded-2xl bg-muted/70 ring-1 ring-border transition-shadow focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/50",
          compact && "rounded-xl",
        )}
      >
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-label={placeholder}
                aria-placeholder={placeholder}
                placeholder={
                  <div className="pointer-events-none absolute top-3 left-4 text-[15px] text-muted-foreground select-none">
                    {placeholder}
                  </div>
                }
                className={cn(
                  "max-h-48 overflow-y-auto px-4 py-3 text-[15px] leading-relaxed outline-none",
                  expanded ? "min-h-20" : "min-h-12",
                )}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <EditorRefPlugin editorRef={editorRef} />
        <OnChangePlugin
          ignoreSelectionChange
          onChange={(state) => state.read(() => setLength($getRoot().getTextContent().trim().length))}
        />
        <ShortcutsPlugin onSubmit={send} onCancel={onCancel} />

        {expanded && (
          <div className="flex items-center gap-1 border-t px-2 py-1.5">
            <FormatButtons />
            {/* Счётчик не резервирует место, пока не нужен: раньше он сдвигал
                кнопку отправки за край на узких экранах. */}
            {showCounter && (
              <span
                className={cn(
                  "shrink-0 pr-1 text-xs tabular-nums text-muted-foreground",
                  tooLong && "font-semibold text-destructive",
                )}
              >
                {length}/{COMMENT_MAX}
              </span>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-accent"
              >
                Отмена
              </button>
            )}
            <button
              type="button"
              aria-label={submitLabel}
              disabled={!canSend}
              onMouseDown={(e) => e.preventDefault()}
              onClick={send}
              className={cn(
                "press flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-bold transition-colors",
                canSend ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {pending ? <Spinner className="size-4" /> : <ArrowUp className="size-4" strokeWidth={2.5} />}
              {!compact && !showCounter && submitLabel}
            </button>
          </div>
        )}
      </div>
    </LexicalComposer>
  );
};
