# Протокол лабораторної роботи №2
## Структурне (white-box) тестування. Модульні та інтеграційні тести

**Проєкт:** IT Courses Platform (серверна частина `server/`)  
**Дата:** 19.05.2026

---

## 1. Обраний проєкт

Express-додаток (`server/app.js`, `server/routes/`, `server/services/`, `server/middleware/`) + клієнтський API-шар `CoursesApiClient` для json-server.

---

## 2. Модульні тести (white-box)

| Модуль | Файл тесту | Що перевіряється |
|--------|------------|------------------|
| `CourseService` | `tests/unit/courseService.test.js` | Гілки: search, category, sort (price/title/duration), getById, null |
| `validateCourseId` | `tests/unit/validateCourseId.test.js` | Regex-валідація, відхилення SQL-подібних рядків |
| `CoursesApiClient` | `tests/unit/coursesApiClient.test.js` | HTTP GET через nock (ізольовано від реального API) |

**Принцип white-box:** тести знають внутрішню логіку (`switch` у `sortCourses`, умови у `getAll`, regex у `isValidCourseId`) і покривають гілки.

---

## 3. Інтеграційні тести

| Файл | Тип | Опис |
|------|-----|------|
| `tests/integration/pages.test.js` | HTTP + EJS | Supertest: GET `/`, `/catalog`, `/course/1` |
| `tests/integration/coursesApi.test.js` | API chain | Client → Service → filter (nock як json-server) |
| `tests/integration/security.test.js` | Security | Відхилення `/course/abc`, injection у path |

**Інструменти:** Jest + Supertest + nock (стаб зовнішнього провайдера без Docker).

---

## 4. Контрактні тести (2 бізнес-процеси)

| BP | Процес | Consumer | Provider (stub) | Схема |
|----|--------|----------|-----------------|-------|
| **BP-1** | Отримання каталогу курсів | `CoursesApiClient.getCourses()` | nock + `wiremock/mappings/get-courses.json` | `contracts/schemas/courses-list.schema.json` |
| **BP-2** | Перегляд деталей курсу | `CoursesApiClient.getCourseById()` | nock + `wiremock/mappings/get-course-by-id.json` | `contracts/schemas/course-detail.schema.json` |

Валідація: Ajv у `tests/helpers/contractValidator.js`.

**Чому nock, а не живий WireMock:** для CI/локального запуску достатньо HTTP-stub; мапінги WireMock збережені як еталон контракту провайдера (можна підняти WireMock окремо за бажанням).

---

## 5. Метрики покриття

Запуск:

```bash
npm run test:coverage
```

Jest збирає покриття для `server/**/*.js` (див. `jest.config.js`).

| Метрика | Що означає | Поріг у проєкті |
|---------|------------|-----------------|
| **Line** | Відсоток виконаних рядків коду | ≥ 70% |
| **Statement** | Відсоток виконаних інструкцій | ≥ 70% |
| **Branch** | Відсоток пройдених гілок if/switch | ≥ 60% |
| **Function** | Відсоток викликаних функцій | ≥ 70% |

Після запуску звіт: `coverage/lcov-report/index.html`.

**Очікувані зони покриття:**
- ✅ `courseService.js`, `validateCourseId.js`, `coursesApiClient.js` — високе покриття
- ⚠️ `app.js` (configureEjsIncludes, loadCoursesFromDb) — частково через інтеграційні тести сторінок
- ⚠️ `pageRoutes.js` — рендер маршрутів через supertest

_Вставте фактичні числа з виводу `npm run test:coverage` у звіт після запуску на своєму ПК._

---

## 6. Команди

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:contract
npm run test:coverage
```

---

## Висновок для захисту

ЛР2 **повністю виконується** на цьому проєкті: є виділена серверна логіка, безпековий middleware, зовнішній API-контракт і готові тести з метриками покриття. Проєкт спеціально підготовлений під QA-лабораторні (див. `package.json` scripts).
