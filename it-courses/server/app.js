const express = require('express');
const path = require('path');
const fs = require('fs');
const createPageRouter = require('./routes/pageRoutes');

function configureEjsIncludes(viewsPath) {
  const ejs = require('ejs');
  const originalInclude = ejs.fileLoader;

  ejs.fileLoader = function fileLoader(filePath) {
    if (!filePath.startsWith('/') && !path.isAbsolute(filePath)) {
      const resolvedPath = path.resolve(viewsPath, filePath);
      if (fs.existsSync(resolvedPath + '.ejs')) {
        return originalInclude(resolvedPath + '.ejs');
      }
    }
    return originalInclude(filePath);
  };
}

function loadCoursesFromDb(rootDir) {
  const dbPath = path.join(rootDir, 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  return db.courses || [];
}

function createApp(options = {}) {
  const rootDir = options.rootDir || path.join(__dirname, '..');
  const viewsPath = path.join(rootDir, 'views');

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', viewsPath);
  configureEjsIncludes(viewsPath);

  app.use(express.static(path.join(rootDir, 'public')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(createPageRouter());

  return app;
}

module.exports = { createApp, loadCoursesFromDb };
