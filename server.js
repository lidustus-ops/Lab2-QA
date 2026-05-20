const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Налаштування EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Налаштування для EJS includes - використовувати абсолютні шляхи від кореня views
const ejs = require('ejs');
const originalInclude = ejs.fileLoader;
ejs.fileLoader = function(filePath) {
  // Якщо шлях не починається з /, додаємо корінь views
  if (!filePath.startsWith('/') && !path.isAbsolute(filePath)) {
    // Перевіряємо, чи це відносний шлях від views
    const viewsPath = path.join(__dirname, 'views');
    const resolvedPath = path.resolve(viewsPath, filePath);
    // Перевіряємо, чи файл існує
    if (require('fs').existsSync(resolvedPath + '.ejs')) {
      return originalInclude(resolvedPath + '.ejs');
    }
  }
  return originalInclude(filePath);
};

// Статичні файли
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршрути
app.get('/', (req, res) => {
  res.render('pages/home', { 
    title: 'IT Courses - Home',
    page: 'home'
  });
});

app.get('/catalog', (req, res) => {
  res.render('pages/catalog', { 
    title: 'IT Courses Catalog',
    page: 'catalog'
  });
});

app.get('/course/:id', (req, res) => {
  const courseId = req.params.id;
  res.render('pages/course-detail', { 
    title: `Course - ${courseId}`,
    page: 'course-detail',
    courseId: courseId
  });
});

app.get('/checkout', (req, res) => {
  res.render('pages/checkout', { 
    title: 'Checkout',
    page: 'checkout'
  });
});

app.get('/thank-you', (req, res) => {
  res.render('pages/thank-you', { 
    title: 'Thank You',
    page: 'thank-you'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

