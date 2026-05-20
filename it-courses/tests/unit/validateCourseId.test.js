const {
  isValidCourseId,
} = require('../../server/middleware/validateCourseId');

describe('validateCourseId', () => {
  it('accepts numeric course id', () => {
    expect(isValidCourseId('1')).toBe(true);
    expect(isValidCourseId(2)).toBe(true);
  });

  it('rejects non-numeric and malicious ids', () => {
    expect(isValidCourseId('abc')).toBe(false);
    expect(isValidCourseId('1; DROP TABLE')).toBe(false);
    expect(isValidCourseId('<script>')).toBe(false);
  });
});
