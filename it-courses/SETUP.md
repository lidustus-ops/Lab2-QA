# Інструкція з налаштування та запуску

## Встановлення залежностей

```bash
npm install
```

## Компіляція SCSS

```bash
npm run build-css
```

Або для автоматичної компіляції при змінах:

```bash
npm run watch-css
```

## Запуск проєкту

### 1. Запуск Express сервера

```bash
npm start
# або для розробки з автоперезавантаженням
npm run dev
```

Сервер буде доступний на `http://localhost:3000`

### 2. Запуск json-server (в окремому терміналі)

```bash
npm run json-server
```

API буде доступне на `http://localhost:3001`

## Структура проєкту

```
it-courses/
├── views/              # EJS шаблони
│   ├── layout.ejs     # Базовий layout
│   ├── pages/         # Сторінки
│   └── partials/      # Часткові компоненти
├── public/            # Статичні файли
│   ├── css/          # Скомпільований CSS
│   ├── js/           # JavaScript файли
│   └── images/       # Зображення
├── scss/             # SCSS файли (архітектура 7-1)
│   ├── abstracts/    # Змінні, функції, міксіни
│   ├── base/         # Базові стилі
│   ├── components/   # Компоненти
│   ├── layout/        # Макети
│   ├── pages/        # Стилі сторінок
│   └── themes/       # Теми
├── db.json           # Дані для json-server
└── server.js         # Express сервер
```

## Реалізовані функції

### Лабораторна 1: Семантична HTML структура ✅
- ✅ 4 сторінки з семантичними тегами
- ✅ Адаптивна структура (picture/srcset готові для додавання)
- ✅ Базова навігація між сторінками
- ✅ EJS шаблонізатор для повторних блоків
- ✅ Мікро-розмітка schema.org (Course, CollectionPage)
- ✅ i18n підготовка (data-i18n атрибути)

### Лабораторна 2: SCSS з методологією ✅
- ✅ Архітектура 7-1 + BEM методологія
- ✅ Міксіни (grid/flex/container/typography)
- ✅ Функції (rem-конвертер, color-mix)
- ✅ Адаптив під 3 брейкпоінти (mobile/tablet/desktop)
- ✅ Utility-класи (spacing/visibility)
- ✅ CSS-анімації (fade-in, slide-in)
- ✅ Кастомний grid-міксін (container/row/col)

### Лабораторна 3: JavaScript логіка ✅
- ✅ Дані з json-server через axios
- ✅ Класова організація (CourseService, OrderService, Paginator)
- ✅ Фільтр + пошук + сортування
- ✅ Пагінація
- ✅ Валідація форм (required/pattern/min/maxlength)
- ✅ Збереження в localStorage
- ✅ Кешування запитів (in-memory + localStorage)
- ✅ Hash-роутер (#/list, #/item/1)
- ✅ Рейтинг з оптимістичним оновленням (готово до реалізації)

## API Endpoints

- `GET http://localhost:3001/courses` - Отримати всі курси
- `GET http://localhost:3001/courses/:id` - Отримати курс за ID
- `POST http://localhost:3001/orders` - Створити замовлення

## Сторінки

- `/` - Головна сторінка
- `/catalog` - Каталог курсів
- `/course/:id` - Деталі курсу
- `/checkout` - Оформлення замовлення
- `/thank-you` - Сторінка подяки

## Примітки

1. Для роботи з json-server потрібно запустити його окремо
2. Зображення курсів повинні бути додані в `public/images/courses/`
3. i18n підтримує українську та англійську мови
4. Всі дані форм зберігаються в localStorage як резервна копія

