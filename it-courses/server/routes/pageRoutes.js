const express = require('express');
const { validateCourseIdParam } = require('../middleware/validateCourseId');

function createPageRouter() {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('pages/home', {
      title: 'IT Courses - Home',
      page: 'home',
    });
  });

  router.get('/catalog', (req, res) => {
    res.render('pages/catalog', {
      title: 'IT Courses Catalog',
      page: 'catalog',
    });
  });

  router.get('/course/:id', validateCourseIdParam, (req, res) => {
    res.render('pages/course-detail', {
      title: `Course - ${req.params.id}`,
      page: 'course-detail',
      courseId: req.params.id,
    });
  });

  router.get('/checkout', (req, res) => {
    res.render('pages/checkout', {
      title: 'Checkout',
      page: 'checkout',
    });
  });

  router.get('/thank-you', (req, res) => {
    res.render('pages/thank-you', {
      title: 'Thank You',
      page: 'thank-you',
    });
  });

  return router;
}

module.exports = createPageRouter;
