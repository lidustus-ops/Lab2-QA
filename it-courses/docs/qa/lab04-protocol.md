# Протокол лабораторної роботи №4
## End-to-end тестування. LLM-агенти в тестуванні

**Проєкт:** IT Courses Platform  
**Дата:** 19.05.2026

---

## Частина 1. E2E з Playwright (Page Object Model)

### Фреймворк

[@playwright/test](https://playwright.dev/) — конфіг: `tests/e2e/playwright.config.js`

### Page Objects

| Клас | Файл | Відповідальність |
|------|------|------------------|
| `CatalogPage` | `tests/e2e/pages/CatalogPage.js` | Каталог, картки курсів |
| `CourseDetailPage` | `tests/e2e/pages/CourseDetailPage.js` | Деталі, Buy |
| `CheckoutPage` | `tests/e2e/pages/CheckoutPage.js` | Форма оплати |
| `ThankYouPage` | `tests/e2e/pages/ThankYouPage.js` | Підтвердження |

### Тест-кейси (2 user flows)

| ID | Spec | User flow |
|----|------|-----------|
| **TC-E2E-01** | `specs/catalog-browse.spec.js` | Catalog → Course detail |
| **TC-E2E-02** | `specs/checkout-flow.spec.js` | Catalog → Course → Buy → Checkout → Thank you |

### Запуск

```bash
npm install
npx playwright install chromium
npm run build-css
npm run test:e2e
```

`playwright.config.js` автоматично піднімає `json-server` (:3001) та Express (:3000).

Звіт HTML: `tests/e2e/playwright-report/`

---

## Частина 2. E2E з LLM-агентами

### Інструменти

- [browser-use](https://browser-use.com/) — агент керує браузером за текстовим завданням
- LLM: Google Gemini (`GOOGLE_API_KEY`) або Mistral — за прикладом з лекції

### Файли в репозиторії

| Файл | Призначення |
|------|-------------|
| `scripts/ai-e2e/end_to_end_runner.js` | Виводить промпти для TC-E2E-01/02 (prompt engineering) |
| `scripts/ai-e2e/browser_use_runner.py` | Повний запуск browser-use (потрібен Python + API key) |

### Запуск промптів (без Python)

```bash
node scripts/ai-e2e/end_to_end_runner.js --case catalog
node scripts/ai-e2e/end_to_end_runner.js --case checkout
```

### Запуск browser-use

```bash
pip install browser-use langchain-google-genai playwright
playwright install chromium
set GOOGLE_API_KEY=your_key
python scripts/ai-e2e/browser_use_runner.py --case checkout
```

### Порівняння підходів (для звіту)

| Критерій | Playwright POM | LLM agent |
|----------|----------------|-----------|
| Стабільність | Висока (селектори фіксовані) | Залежить від промпта/моделі |
| Швидкість | Швидко | Повільніше (reasoning) |
| Підтримка | Потрібно оновлювати PO при зміні UI | Можна змінити промпт |
| CI/CD | Нативна інтеграція | Потрібен API key, складніше в CI |

---

## Висновок

ЛР4 **повністю виконується** на IT Courses: є реальні user flows, Playwright + POM реалізовано, для LLM-частини надано промпти та Python-runner за зразком лекції.
