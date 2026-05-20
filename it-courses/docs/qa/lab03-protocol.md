# Протокол лабораторної роботи №3
## Нефункціональне тестування: навантаження та безпека

**Проєкт:** IT Courses Platform  
**Дата:** 19.05.2026

---

## Частина 1. Навантажувальне тестування

### Інструмент

**Grafana k6** — сценарій у `perf/k6-load-test.js`.

### Підготовка

```bash
npm run build-css
npm start
# окремий термінал (опційно для повного E2E): npm run json-server
```

Встановити k6: https://grafana.com/docs/k6/latest/set-up/install-k6/

### Сценарії

| Сценарій | Команда | Мета |
|----------|---------|------|
| Ramp-up | `k6 run perf/k6-load-test.js` | Поступове зростання 0→50 VU |
| Stress | `k6 run -e SCENARIO=stress perf/k6-load-test.js` | Знайти точку деградації (до 300 VU) |
| Spike | `k6 run -e SCENARIO=spike perf/k6-load-test.js` | Стрибок 5→150 VU за 5 с |

### Ендпоінти під навантаження

Тестуються серверні HTML-маршрути Express (не json-server): `/`, `/catalog`, `/course/1`, `/checkout`.

### Що занести в протокол після запуску

| Показник | Де взяти |
|----------|----------|
| Гранична кількість користувачів (стабільно) | Останній етап ramp, де `http_req_failed < 5%` |
| Медіанний час відповіді | `http_req_duration` → med у виводі k6 |
| Стандартне відхилення | stddev у summary / `perf/k6-summary.json` |
| Точка «поломки» (stress) | VU, де failed rate > 5% або p95 > 2000 ms |
| Spike | Порівняти failed rate під час 150 VU vs baseline |

_Шаблон таблиці — заповнити власними числами:_

| Сценарій | Max VU | Failed % | Median (ms) | Std dev (ms) | p95 (ms) |
|----------|--------|----------|-------------|--------------|----------|
| Ramp | | | | | |
| Stress | | | | | |
| Spike | | | | | |

### Обмеження на цьому проєкті

- ⚠️ **Частково:** для повного навантаження API json-server потрібен окремий сценарій k6 на `:3001`; поточний скрипт фокусується на **серверній частині Express** (вимога ЛР2–3 з курсу веб-розробки).
- Статичні файли + EJS рендер — репрезентативно для SSR-навантаження.

---

## Частина 2. Безпекове тестування (інʼєкції)

### 2.1. OWASP Top 10 (коротко)

Актуальний список: https://owasp.org/www-project-top-ten/

Для навчальних лаб використовуються навмисно вразливі додатки:

| Додаток | Призначення |
|---------|-------------|
| [bWAPP](http://www.itsecgames.com/) | SQLi, XSS, CSRF |
| [OWASP Juice Shop](https://github.com/juice-shop/juice-shop) | Сучасний vulnerable e-commerce |
| [OWASP WebGoat](https://owasp.org/www-project-webgoat/) | Інтерактивні уроки |

**Завдання ЛР:** провести SQL та HTML інʼєкції на одному з цих додатків (локально в Docker / VM), описати знахідки в протоколі.

_Приклад для Juice Shop (заповніть після власного проходження):_

| Вразливість | Кроки | Ризик | Захист |
|-------------|-------|-------|--------|
| SQL Injection (login) | `' OR 1=1--` у полі email | Обхід автентифікації | Prepared statements, parameterized queries |
| XSS (reflected) | `<script>alert(1)</script>` у search | Виконання JS у браузері жертви | Escape output, CSP |

---

### 2.2. Аудит IT Courses Platform

| OWASP / Ризик | Статус у проєкті | Рекомендація |
|---------------|------------------|--------------|
| **A03 Injection (path)** | ✅ Mitigated | `validateCourseId` — лише `\d+` (`server/middleware/validateCourseId.js`) |
| **A03 Injection (SQL)** | N/A на Express | Немає SQL на сервері; json-server лише для dev |
| **A03 XSS (stored/reflected)** | ⚠️ Потенційно | `goalsEl.innerHTML = course.goals.map(...)` у `public/js/app.js` — якщо API поверне `<script>`, можливий XSS |
| **A02 Cryptographic Failures** | ⚠️ | Номер картки відправляється на json-server без шифрування; для prod — PCI DSS, не зберігати CVV |
| **A05 Security Misconfiguration** | ⚠️ | Немає helmet, CORS не налаштовано |
| **A07 XSS (DOM)** | ⚠️ | innerHTML для goals/illustration |
| **A09 Logging** | ⚠️ | Немає централізованого логування security-подій |

**Перевірки, які вже автоматизовані:**

```bash
npm run test:integration -- --testPathPattern=security
```

- `GET /course/abc` → 400  
- `GET /course/1%3B%20DROP%20TABLE` → 400  

**Ручні перевірки для звіту:**

1. Відкрити `/course/<script>alert(1)</script>` — очікується 400 (не виконання скрипта).
2. У DevTools спробувати підмінити `db.json` goals на рядок з HTML — перевірити чи спрацює XSS на сторінці курсу.
3. Перевірити, що checkout не відправляє дані на сторонні домени (лише localhost:3001).

---

## Висновок

| Частина | Виконання на IT Courses |
|---------|-------------------------|
| Ramp / Stress / Spike | ✅ Скрипт k6 готовий; метрики — після запуску на ПК |
| SQL/HTML на bWAPP/Juice Shop | ⚠️ Окремий vulnerable-додаток (не цей репозиторій) |
| Аудит власного проєкту | ✅ Описано + частково автотести security |
