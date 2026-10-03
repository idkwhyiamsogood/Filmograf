# Filmograf — frontend

Сборка и запуск на Android:

1. `bun i` — установить зависимости
2. `bun run build` — собрать веб-бандл
3. `bun run cap:sync` — синхронизировать сборку с нативным проектом
4. `bun run cap:android` — сгенерировать Android-проект (один раз)
5. `bun run cap:open:android` — открыть проект в Android Studio
6. Запустить приложение из Android Studio

Для разработки в браузере: `bun run dev`.

Общее описание проекта и архитектурных решений — в [README в корне](../README.md).
