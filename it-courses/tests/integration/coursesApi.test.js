const nock = require('nock');
const CoursesApiClient = require('../../server/services/coursesApiClient');
const CourseService = require('../../server/services/courseService');
const { sampleCourses } = require('../fixtures/courses');

describe('Integration: json-server courses API', () => {
  const apiBase = 'http://127.0.0.1:3001';

  afterEach(() => {
    nock.cleanAll();
  });

  it('fetches catalog and applies server-side filters', async () => {
    nock(apiBase).get('/courses').reply(200, sampleCourses);

    const client = new CoursesApiClient(apiBase);
    const courses = await client.getCourses();
    const service = new CourseService(courses);
    const technical = service.getAll({ category: 'technical' });

    expect(technical).toHaveLength(2);
    expect(nock.isDone()).toBe(true);
  });

  it('fetches single course by id', async () => {
    nock(apiBase).get('/courses/1').reply(200, sampleCourses[0]);

    const client = new CoursesApiClient(apiBase);
    const course = await client.getCourseById(1);

    expect(course.title).toBe('QA engineer');
    expect(nock.isDone()).toBe(true);
  });

  it('propagates 404 when course not found', async () => {
    nock(apiBase).get('/courses/999').reply(404, { error: 'Not found' });

    const client = new CoursesApiClient(apiBase);

    await expect(client.getCourseById(999)).rejects.toMatchObject({
      status: 404,
    });
  });
});
