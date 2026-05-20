# QA-лабораторні роботи — IT Courses Platform

Цей каталог містить протоколи та артефакти для лабораторних з дисципліни тестування ПЗ.

| ЛР | Тема | Можливість на проєкті | Статус |
|----|------|----------------------|--------|
| 1 | Формалізація вимог, user stories, тест-кейси | ✅ Повністю | [lab01-protocol.md](./lab01-protocol.md) |
| 2 | White-box, модульні, інтеграційні, контрактні тести | ✅ Повністю | [lab02-protocol.md](./lab02-protocol.md) + `tests/` |
| 3 | Навантажувальне + безпекове тестування | ⚠️ Частково | [lab03-protocol.md](./lab03-protocol.md) + `perf/` |
| 4 | E2E (Playwright) + LLM-агенти | ✅ Повністю* | [lab04-protocol.md](./lab04-protocol.md) + `tests/e2e/` |

\* E2E потребує запущених `npm start` та `npm run json-server`.

## Швидкий запуск тестів

```bash
npm install
npm test                  # unit + integration + contract
npm run test:coverage     # метрики покриття
npm run test:e2e          # Playwright (після npm run build-css)
```

## Структура

```
docs/qa/           — протоколи ЛР1–4
tests/unit/        — модульні тести (ЛР2)
tests/integration/ — інтеграційні + security (ЛР2)
tests/contract/    — контрактні тести BP-1, BP-2 (ЛР2)
tests/e2e/         — Playwright E2E (ЛР4)
perf/              — сценарії k6 (ЛР3)
scripts/ai-e2e/    — LLM E2E runner (ЛР4)
wiremock/          — мапінги для контрактних тестів
contracts/schemas/ — JSON Schema контрактів
```
