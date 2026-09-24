# Modal Context

Безголовый (headless) менеджер стека модалок: контекст + провайдер держат
массив открытых модалок, `ModalRenderer` рендерит их по реестру компонентов.
Сам модуль не рисует ни оверлея, ни диалогового окна — вёрстку и анимацию
даёт конкретная модалка (например, обёртка над `Dialog` из `shadcn/ui`),
а `modal-context` только решает, **какие** модалки сейчас открыты, в каком
порядке и с какими пропами.

```bash
shared-library add ModalContext
```

Ставит только `react` и копирует модуль в `aliases.shared` (по умолчанию
`@/shared/contexts/modal-context`). Tailwind и UI-примитивы не требуются —
это чистая логика, без единого элемента разметки со стилями.

## Состав

| Файл | Что делает |
|---|---|
| `modal.context.tsx` | `ModalContext` + `ModalProvider`: хранит `activeModals` (стек), даёт `openModal` / `closeModal` / `closeModals` |
| `useModals.ts` | Хук доступа к контексту; бросает ошибку, если вызван вне `ModalProvider` |
| `ModalRenderer.tsx` | Проходит по `activeModals`, для каждой берёт компонент из `MODALS` и рендерит его с `isOpen`, `closeModal`, `zIndex` |
| `modals.ts` | Реестр `MODALS: Record<ModalType, FC>` — какой компонент отвечает за какой `ModalType`. Пустой по умолчанию, заполняется под конкретный проект |
| `modals.type.ts` | `ModalTypeEnum`, `ModalType`, расширяемый `ModalPropsMap`, `ModalOptions`, `OpenModalArgs`, `BaseModalProps` |
| `index.ts` | Точка входа: реэкспортирует `ModalRenderer`, `useModals`, `ModalProvider` |

## Подключение

```tsx
// app/providers.tsx
import { ModalProvider, ModalRenderer } from "@/shared/contexts/modal-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      {children}
      <ModalRenderer />
    </ModalProvider>
  );
}
```

`ModalRenderer` рендерит все активные модалки одним списком — размещайте его
один раз, ближе к корню дерева.

## Как добавить новую модалку

Модуль ставится как исходники в ваш проект (как shadcn/ui), поэтому
`ModalTypeEnum` и `MODALS` — это ваши локальные файлы, которые вы дополняете
руками при добавлении каждой новой модалки.

1. **Заведите ключ в `ModalTypeEnum`** (в своей копии `modals.type.ts`):

   ```ts
   export const ModalTypeEnum = {
     TECH_TAG: "TECH_TAG",
   } as const;
   ```

   `ModalTypeEnum` — обычный объект, а не `interface`, поэтому его нельзя
   расширить через `declare module` — новые ключи дописываются прямо здесь.

2. **Опишите пропы модалки через declaration merging**, в `declare.ts` рядом
   с самой модалкой:

   ```ts
   // modules/Tech/TechModal/declare.ts
   import type { TechModalProps } from "./props";

   declare module "@/shared/contexts/modal-context/modals.type" {
     export interface ModalPropsMap {
       [ModalTypeEnum.TECH_TAG]: TechModalProps;
     }
   }
   ```

   Путь в `declare module "..."` должен буквально совпадать с тем, куда вы
   поставили `modal-context` (alias можно поменять при установке) — иначе
   TypeScript просто не смержит интерфейсы и `openModal` не подхватит типы.
   Именно за счёт этого шага `ModalPropsMap` — единственная связь между
   `modal-context` и конкретной модалкой: сам модуль ничего не знает про
   `TechModalProps`, но после augmentation `openModal("TECH_TAG", props)`
   типизирован полностью.

3. **Компонент модалки** принимает `BaseModalProps` (`isOpen`, `closeModal`)
   плюс свои пропы из `ModalPropsMap`, и сам решает, как рендериться (диалог,
   свой оверлей и т.д.).

4. **Зарегистрируйте её в `modals.ts`**, обычно с ленивой загрузкой:

   ```ts
   export const MODALS: Record<ModalType, FC<any>> = {
     TECH_TAG: lazy(() =>
       import("@/modules/Tech/TechModal").then((m) => ({
         default: m.TechModal,
       })),
     ),
   };
   ```

5. **Откройте модалку** из любого места под `ModalProvider`:

   ```ts
   const { openModal } = useModals();
   openModal("TECH_TAG", { tech });
   ```

## Пример: TechModal

Разберём конкретную модалку, построенную поверх `modal-context`, — тег
технологии со своей иконкой, описанием и акцентным цветом.

- **`props.ts`** — единственное, что модалка добавляет к контракту:
  `interface TechModalProps { tech: Tech }`. Это и есть тип, который дальше
  подставится в `ModalPropsMap`.

- **`declare.ts`** — точка сцепки с `modal-context`:

  ```ts
  declare module "@/modules/ModalContext/modals.type" {
    export interface ModalPropsMap {
      [ModalTypeEnum.TECH_TAG]: TechModalProps;
    }
  }
  ```

  Обратите внимание: здесь путь — `@/modules/ModalContext/modals.type`, то
  есть в этом конкретном проекте `modal-context` установлен не в дефолтный
  `@/shared/contexts/modal-context`, а в кастомный alias `@/modules/ModalContext`.
  Это нормально — при переносе примера в другой проект путь в `declare module`
  надо поправить под фактическое расположение модуля, иначе слияние типов
  просто не произойдёт (TS не ругнётся, `ModalPropsMap` тихо останется без
  `TECH_TAG`).

- **`TechModal.tsx`** — сам компонент:
  - принимает `TechModalProps & BaseModalProps` (`tech`, `isOpen`, `closeModal`);
  - `useEscapeKey(closeModal)` — закрытие по `Esc` модалка обеспечивает себе
    сама, `modal-context` за это не отвечает;
  - оборачивает контент в `Dialog` / `DialogPortal` / `DialogContent` /
    `DialogPopup` (общий примитив диалога проекта), а не в свою разметку —
    `modal-context` не диктует, на чём рисовать модалку;
  - `open={isOpen}` и `onOpenChange={(open) => !open && closeModal()}` —
    так `closeModal` вызывается и по клику вне модалки / другому способу
    закрытия из самого `Dialog`, не только по кнопке `×`;
  - акцентный цвет технологии прокидывается как CSS-переменная
    (`style={{ "--modal-accent": tech.color }}`), а `TechModal.module.css`
    через `color-mix()` строит на её основе производный `--modal-ink` —
    цвет точки-индикатора, свечения и обводки иконки;
  - `DialogClose` — кнопка `×`, использует тот же примитив, что и остальные
    диалоги проекта.

- **`index.ts`** — просто `export * from "./TechModal"`, ничего необычного.

Чего в этом примере **нет** и что нужно добавить отдельно, если брать его
как шаблон: строчки в `ModalTypeEnum` (`TECH_TAG: "TECH_TAG"`) и записи в
`MODALS` (`TECH_TAG: lazy(() => import(...))`) — сам пример содержит только
declare.ts + компонент, а не полную интеграцию с шагами 1 и 4 выше.

## Заметки

- **`ModalRenderer` импортирует `Suspense`, но не использует его** — если в
  `MODALS` регистрируются `lazy(...)`-компоненты (как в примере выше), сам
  `ModalRenderer` их ничем не оборачивает. Оборачивайте `<ModalRenderer />`
  (или конкретные модалки) в `<Suspense fallback={...}>` сами, иначе первая
  загрузка чанка модалки бросит ошибку вместо фолбэка.
- **`closeModal(type)` закрывает все модалки этого типа разом** — `activeModals`
  фильтруется по `modalType`, а не по конкретному инстансу. Если открыть один
  и тот же `ModalType` дважды (стек не проверяет дубликаты), `closeModal(type)`
  закроет обе сразу, а `key={modal.modalType}` в `ModalRenderer` даст
  React-предупреждение о задублированных ключах.
- **`closeModal()` без аргумента** снимает верхнюю модалку стека (`slice(0, -1)`) —
  это поведение "закрыть последнее открытое", а не "закрыть всё".
- **`zIndex` в пропах модалки не типизирован** — `ModalRenderer` прокидывает
  `zIndex={1000 + index}`, но `BaseModalProps` его не объявляет. Компонент
  модалки может либо принять и использовать его сам (добавив в свой props-тип),
  либо просто игнорировать, как делает `TechModal`.
- **`ModalTypeEnum` и `MODALS` — не расширяются, а редактируются.** В отличие
  от `ModalPropsMap` (интерфейс, живёт через declaration merging), это обычные
  константы/объекты — единственный способ добавить новый тип модалки — правка
  файлов `modals.type.ts` / `modals.ts` в своей копии модуля.
