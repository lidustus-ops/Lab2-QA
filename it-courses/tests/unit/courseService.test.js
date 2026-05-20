const CourseService = require('../../server/services/courseService');
const { sampleCourses } = require('../fixtures/courses');

describe('CourseService', () => {
  let service;

  beforeEach(() => {
    service = new CourseService(sampleCourses);
  });

  it('returns all courses without filters', () => {
    expect(service.getAll()).toHaveLength(3);
  });

  it('filters courses by search term', () => {
    const result = service.getAll({ search: 'qa' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('QA engineer');
  });

  it('filters courses by category', () => {
    const technical = service.getAll({ category: 'technical' });
    expect(technical.every((course) => course.category === 'technical')).toBe(true);
    expect(technical).toHaveLength(2);
  });

  it('sorts courses by price ascending', () => {
    const sorted = service.getAll({ sort: 'price' });
    expect(sorted[0].price).toBe(1600);
    expect(sorted[2].price).toBe(2200);
  });

  it('returns course by id', () => {
    const course = service.getById(2);
    expect(course.title).toBe('Front-end developer');
  });

  it('returns null for unknown id', () => {
    expect(service.getById(999)).toBeNull();
  });

  it('returns courses by category helper', () => {
    const nonTechnical = service.getByCategory('non-technical');
    expect(nonTechnical).toHaveLength(1);
  });
});
