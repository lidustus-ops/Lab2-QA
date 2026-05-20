const assert = require('assert');
const CourseService = require('../server/services/courseService');
const { isValidCourseId } = require('../server/middleware/validateCourseId');
const { sampleCourses } = require('../tests/fixtures/courses');

const service = new CourseService(sampleCourses);
const technical = service.getAll({ category: 'technical' });

assert.strictEqual(technical.length, 2);
assert.strictEqual(isValidCourseId('1'), true);
assert.strictEqual(isValidCourseId('x'), false);

console.log('Smoke verification passed.');
