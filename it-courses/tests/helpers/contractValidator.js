const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function loadSchema(schemaFileName) {
  const schemaPath = path.join(
    __dirname,
    '..',
    '..',
    'contracts',
    'schemas',
    schemaFileName
  );
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  return ajv.compile(schema);
}

module.exports = {
  validateCoursesList: loadSchema('courses-list.schema.json'),
  validateCourseDetail: loadSchema('course-detail.schema.json'),
};
