// Course Service
// Note: httpClient and cache should be available globally

class CourseService {
  constructor() {
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
  }

  // Get all courses with caching
  async getAllCourses(filters = {}) {
    const cacheKey = `courses:all:${JSON.stringify(filters)}`;
    
    // Check cache first
    const cached = window.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      let courses = await window.httpClient.get('/courses');
      
      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        courses = courses.filter(course => 
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.category) {
        courses = courses.filter(course => course.category === filters.category);
      }

      // Apply sorting
      if (filters.sort) {
        courses = this.sortCourses(courses, filters.sort);
      }

      // Cache the result
      window.cache.set(cacheKey, courses, this.cacheTTL);
      
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Get course by ID
  async getCourseById(id) {
    const cacheKey = `course:${id}`;
    
    // Check cache first
    const cached = window.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const course = await window.httpClient.get(`/courses/${id}`);
      
      // Cache the result
      window.cache.set(cacheKey, course, this.cacheTTL);
      
      return course;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  // Sort courses
  sortCourses(courses, sortBy) {
    const sorted = [...courses];
    
    switch (sortBy) {
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'price':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        sorted.sort((a, b) => {
          const aDuration = parseInt(a.duration);
          const bDuration = parseInt(b.duration);
          return aDuration - bDuration;
        });
        break;
      default:
        break;
    }
    
    return sorted;
  }

  // Update course rating (optimistic update)
  async updateRating(courseId, rating) {
    try {
      // Optimistic update - update UI immediately
      const course = await this.getCourseById(courseId);
      const updatedCourse = { ...course, rating };
      
      // Update cache
      window.cache.set(`course:${courseId}`, updatedCourse, this.cacheTTL);
      
      // Update on server (in real app, this would be a PATCH request)
      // For now, we'll just update locally
      
      return updatedCourse;
    } catch (error) {
      console.error('Error updating rating:', error);
      throw error;
    }
  }

  // Clear course cache
  clearCache() {
    const keys = Array.from(window.cache.memoryCache.keys());
    keys.forEach(key => {
      if (key.startsWith('course')) {
        window.cache.remove(key);
      }
    });
  }
}

// Export singleton instance
const courseService = new CourseService();
window.courseService = courseService;

