# IT Courses Platform

Платформа для IT курсів, що об'єднує три лабораторні роботи.

## Структура проєкту

### Лабораторна 1: Семантична HTML структура
- 4 сторінки з семантичними тегами (header/nav/main/section/article/footer)
- Адаптивна структура з picture/srcset
- Базова навігація між сторінками
- EJS шаблонізатор для повторних блоків
- Мікро-розмітка schema.org
- i18n підготовка

### Лабораторна 2: SCSS з методологією
- Архітектура 7-1 + BEM методологія
- Міксіни та функції (grid/flex/container/typography)
- Адаптив під 3 брейкпоінти
- Utility-класи та CSS-анімації
- Кастомний grid-міксін

### Лабораторна 3: JavaScript логіка
- Дані з json-server через axios
- Фільтр + пошук + сортування
- Пагінація + форма з валідацією
- Кешування запитів
- Hash-роутер (#/list, #/item/1)
- Рейтинг з оптимістичним оновленням

## Встановлення

```bash
npm install
```

## Запуск

### Розробка
```bash
# Термінал 1: Запуск сервера
npm run dev

# Термінал 2: Запуск json-server
npm run json-server

# Термінал 3: Компіляція SCSS (опціонально, якщо не використовуєте watch)
npm run watch-css
```

### Продакшн
```bash
npm run build-css
npm start
```

## Структура папок

```
it-courses/
├── views/           # EJS шаблони
├── public/          # Статичні файли
│   ├── css/        # Скомпільований CSS
│   ├── js/         # JavaScript файли
│   └── images/     # Зображення
├── scss/           # SCSS файли (архітектура 7-1)
├── db.json         # Дані для json-server
└── server.js       # Express сервер
```

## API Endpoints

- `GET /api/courses` - Отримати всі курси
- `GET /api/courses/:id` - Отримати курс за ID
- `POST /api/orders` - Створити замовлення

## Кольори

- Текст: `#5C0294F2`, `#FFFFFF`
- Фон: `#DDF3FF`
- Меню: `#7892D3`
- Кнопки: `#5C0294F2`, `#5C029440`
- Картки: `#5C0294F2`, `#9370DB`

## Шрифти

- Заголовки: Inter 40 Extra Bold
- Підзаголовки: Inter 36 Semi Bold
- Назви карток: Roboto 20 Semi Bold
- Основний текст: Roboto 20 Regular
- Додаткова інформація: Inter 11 SemiBold
- Кнопки: Roboto 20 Medium

