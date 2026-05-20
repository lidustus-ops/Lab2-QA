class CourseService {
  constructor(courses = []) {
    this.courses = courses;
  }

  getAll(filters = {}) {
    let result = [...this.courses];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term)
      );
    }

    if (filters.category) {
      result = result.filter((course) => course.category === filters.category);
    }

    if (filters.sort) {
      result = this.sortCourses(result, filters.sort);
    }

    return result;
  }

  getById(id) {
    const numericId = Number(id);
    return this.courses.find((course) => course.id === numericId) || null;
  }

  getByCategory(category) {
    return this.courses.filter((course) => course.category === category);
  }

  sortCourses(courses, sortBy) {
    const sorted = [...courses];

    switch (sortBy) {
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'price':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'duration': {
        const durationValue = (value) => parseInt(String(value), 10) || 0;
        sorted.sort(
          (a, b) => durationValue(a.duration) - durationValue(b.duration)
        );
        break;
      }
      default:
        break;
    }

    return sorted;
  }
}

module.exports = CourseService;
