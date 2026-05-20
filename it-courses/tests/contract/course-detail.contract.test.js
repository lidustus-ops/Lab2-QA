const nock = require('nock');
const fs = require('fs');
const path = require('path');
const CoursesApiClient = require('../../server/services/coursesApiClient');
const { sampleCourses } = require('../fixtures/courses');
const { validateCourseDetail } = require('../helpers/contractValidator');

/**
 * BP-2: Перегляд деталей курсу
 * Consumer: CoursesApiClient | Provider: json-server (stub через nock / WireMock)
 */
describe('Contract BP-2: Course detail', () => {
  const wiremockMapping = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../../wiremock/mappings/get-course-by-id.json'),
      'utf-8'
    )
  );

  afterEach(() => {
    nock.cleanAll();
  });

  it('provider response matches course detail contract schema', async () => {
    const stubBase = 'http://127.0.0.1:8092';
    const expectedBody = wiremockMapping.response.jsonBody;

    nock(stubBase)
      .get(wiremockMapping.request.urlPath)
      .reply(wiremockMapping.response.status, expectedBody);

    const client = new CoursesApiClient(stubBase);
    const course = await client.getCourseById(1);

    expect(validateCourseDetail(course)).toBe(true);
    expect(course.id).toBe(expectedBody.id);
    expect(nock.isDone()).toBe(true);
  });

  it('project fixture fulfills the same consumer contract', () => {
    expect(validateCourseDetail(sampleCourses[0])).toBe(true);
    expect(sampleCourses[0].title).toBe('QA engineer');
  });
});
