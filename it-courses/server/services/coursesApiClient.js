const axios = require('axios');

class CoursesApiClient {
  constructor(baseURL = process.env.COURSES_API_URL || 'http://localhost:3001') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getCourses() {
    const response = await this.client.get('/courses');
    return response.data;
  }

  async getCourseById(id) {
    const response = await this.client.get(`/courses/${id}`);
    return response.data;
  }
}

module.exports = CoursesApiClient;
