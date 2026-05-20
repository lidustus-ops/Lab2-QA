// Main application file
// Note: All services should be available globally

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Initialize routes
  initRoutes();
  
  // Initialize home page
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    loadTrendingCourses();
  }

  // Initialize catalog page
  if (window.location.pathname === '/catalog') {
    initCatalogPage();
  }

  // Initialize course detail page
  if (window.location.pathname.startsWith('/course/')) {
    const courseId = window.location.pathname.split('/course/')[1];
    loadCourseDetail(courseId);
  }

  // Initialize checkout page
  if (window.location.pathname === '/checkout') {
    initCheckoutPage();
  }
}

// Initialize routes
function initRoutes() {
  router.route('/', () => {
    loadTrendingCourses();
  });

  router.route('/catalog', () => {
    initCatalogPage();
  });

  router.route('/course/:id', (id) => {
    loadCourseDetail(id);
  });

  router.route('/checkout', () => {
    initCheckoutPage();
  });
}

// Load trending courses on home page
let currentTrendingIndex = 0;
let trendingCourses = [];

async function loadTrendingCourses() {
  const container = document.getElementById('trendingCourses');
  const indicatorsContainer = document.getElementById('trendingIndicators');
  if (!container) return;

  try {
    const courses = await window.courseService.getAllCourses();
    // Filter specific courses: QA engineer, UI/UX designer, Data Analyst
    const courseTitles = ['QA engineer', 'UI/UX designer', 'Data Analyst'];
    trendingCourses = courses.filter(course => courseTitles.includes(course.title));
    
    // Render all courses
    container.innerHTML = trendingCourses.map(course => renderCourseCard(course)).join('');
    
    // Create indicators
    if (indicatorsContainer) {
      indicatorsContainer.innerHTML = trendingCourses.map((_, index) => 
        `<button class="home__trending-indicators-dot ${index === 0 ? 'home__trending-indicators-dot--active' : ''}" 
                 data-index="${index}" 
                 aria-label="Go to course ${index + 1}"
                 role="tab"
                 aria-selected="${index === 0}"></button>`
      ).join('');
      
      // Attach indicator click handlers
      indicatorsContainer.querySelectorAll('.home__trending-indicators-dot').forEach((dot, index) => {
        dot.addEventListener('click', () => goToTrendingSlide(index));
      });
    }
    
    // Attach navigation handlers
    const prevBtn = document.getElementById('trendingPrev');
    const nextBtn = document.getElementById('trendingNext');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToTrendingSlide(currentTrendingIndex - 1));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToTrendingSlide(currentTrendingIndex + 1));
    }
    
    // Initialize slider
    updateTrendingSlider();
    
    // Attach click handlers for course cards
    attachCourseCardHandlers();
  } catch (error) {
    console.error('Error loading trending courses:', error);
    container.innerHTML = '<p>Error loading courses. Please try again later.</p>';
  }
}

// Navigate to specific slide
function goToTrendingSlide(index) {
  const container = document.getElementById('trendingCourses');
  const indicatorsContainer = document.getElementById('trendingIndicators');
  if (!container || trendingCourses.length === 0) return;
  
  // Clamp index to valid range
  currentTrendingIndex = Math.max(0, Math.min(index, trendingCourses.length - 1));
  
  // Calculate scroll position (for mobile) or transform (for desktop)
  const isMobile = window.innerWidth <= 479;
  
  if (isMobile) {
    // Mobile: scroll to show one card at a time
    const cards = container.querySelectorAll('.course-card');
    if (cards[currentTrendingIndex]) {
      cards[currentTrendingIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  } else {
    // Desktop: scroll to show current card
    const cards = container.querySelectorAll('.course-card');
    if (cards[currentTrendingIndex]) {
      const cardWidth = cards[0]?.offsetWidth || 0;
      const gap = 16; // $spacing-md
      const scrollPosition = currentTrendingIndex * (cardWidth + gap);
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }
  
  // Update indicators
  if (indicatorsContainer) {
    const dots = indicatorsContainer.querySelectorAll('.home__trending-indicators-dot');
    dots.forEach((dot, i) => {
      if (i === currentTrendingIndex) {
        dot.classList.add('home__trending-indicators-dot--active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('home__trending-indicators-dot--active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  }
  
  updateTrendingSlider();
}

// Update slider state (enable/disable buttons)
function updateTrendingSlider() {
  const prevBtn = document.getElementById('trendingPrev');
  const nextBtn = document.getElementById('trendingNext');
  
  if (prevBtn) {
    prevBtn.disabled = currentTrendingIndex === 0;
  }
  
  if (nextBtn) {
    nextBtn.disabled = currentTrendingIndex >= trendingCourses.length - 1;
  }
}

// Initialize catalog page

async function initCatalogPage() {
  const technicalContainer = document.getElementById('technicalCourses');
  const nonTechnicalContainer = document.getElementById('nonTechnicalCourses');

  try {
    const courses = await window.courseService.getAllCourses();
    
    // Filter specific courses for each category
    const technicalTitles = ['QA engineer', 'Front-end developer'];
    const nonTechnicalTitles = ['Data Analyst', 'UI/UX designer'];
    
    const technical = courses.filter(c => technicalTitles.includes(c.title));
    const nonTechnical = courses.filter(c => nonTechnicalTitles.includes(c.title));

    // Render
    if (technicalContainer) {
      technicalContainer.innerHTML = technical.map(c => renderCourseCard(c)).join('');
    }

    if (nonTechnicalContainer) {
      nonTechnicalContainer.innerHTML = nonTechnical.map(c => renderCourseCard(c)).join('');
    }

    // Attach click handlers
    attachCourseCardHandlers();
  } catch (error) {
    console.error('Error loading catalog courses:', error);
    if (technicalContainer) {
      technicalContainer.innerHTML = '<p>Error loading courses. Please try again later.</p>';
    }
    if (nonTechnicalContainer) {
      nonTechnicalContainer.innerHTML = '<p>Error loading courses. Please try again later.</p>';
    }
  }
}


// Load course detail
async function loadCourseDetail(courseId) {
  try {
    const course = await window.courseService.getCourseById(courseId);
    
    // Update page content
    const titleEl = document.getElementById('courseTitle');
    const sessionsInfoEl = document.getElementById('courseSessionsInfo');
    const priceEl = document.getElementById('coursePriceValue');
    const goalsEl = document.getElementById('courseGoals');
    const descriptionEl = document.getElementById('courseDescription');
    const whoIsTitleEl = document.getElementById('whoIsTitleCourse');
    const imageEl = document.getElementById('courseImage');
    const illustrationEl = document.getElementById('courseIllustration');
    const buyButton = document.getElementById('buyButton');

    if (titleEl) titleEl.textContent = course.title;
    if (sessionsInfoEl) {
      sessionsInfoEl.textContent = `${course.sessions} sessions (${course.sessionsPerWeek} sessions per week)`;
    }
    if (priceEl) priceEl.textContent = `$${course.price}`;
    if (whoIsTitleEl) {
      // Capitalize first letter
      const title = course.title.toLowerCase();
      whoIsTitleEl.textContent = title.charAt(0).toUpperCase() + title.slice(1);
    }
    
    if (goalsEl && course.goals) {
      goalsEl.innerHTML = course.goals.map(goal => `<li>${goal}</li>`).join('');
    }
    
    if (descriptionEl) descriptionEl.textContent = course.description;
    
    // Use course-info.jpg as background
    if (imageEl) {
      imageEl.style.backgroundImage = `url('/images/course-info.jpg')`;
    }
    
    // Add illustration based on course
    if (illustrationEl) {
      const imageMap = {
        'QA engineer': '/images/qa.jpg',
        'Front-end developer': '/images/frontend.jpg',
        'UI/UX designer': '/images/ui-ux.jpg',
        'Data Analyst': '/images/data-analyst.png'
      };
      const illustrationSrc = imageMap[course.title] || '/images/courses/default.jpg';
      illustrationEl.innerHTML = `<img src="${illustrationSrc}" alt="${course.title} illustration">`;
    }

    if (buyButton) {
      buyButton.addEventListener('click', () => {
        // Store course in localStorage for checkout
        localStorage.setItem('selectedCourse', JSON.stringify(course));
        window.location.href = '/checkout';
      });
    }
  } catch (error) {
    console.error('Error loading course detail:', error);
  }
}

// Initialize checkout page
function initCheckoutPage() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  // Load selected course if available
  const selectedCourse = localStorage.getItem('selectedCourse');
  if (selectedCourse) {
    try {
      const course = JSON.parse(selectedCourse);
      const courseNameInput = document.getElementById('courseName');
      if (courseNameInput) {
        courseNameInput.value = course.title;
      }
    } catch (error) {
      console.error('Error parsing selected course:', error);
    }
  }

  // Form validation
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (validateForm(form)) {
      await submitOrder(form);
    }
  });

  // Real-time validation
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

// Validate form
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required]');
  
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  return isValid;
}

// Validate single field
function validateField(input) {
  const errorEl = document.getElementById(`${input.id}-error`);
  let isValid = true;
  let errorMessage = '';

  // Required validation
  if (input.hasAttribute('required') && !input.value.trim()) {
    isValid = false;
    errorMessage = 'This field is required';
  }
  
  // Pattern validation
  if (isValid && input.hasAttribute('pattern')) {
    const pattern = new RegExp(input.getAttribute('pattern'));
    if (!pattern.test(input.value)) {
      isValid = false;
      errorMessage = 'Invalid format';
    }
  }
  
  // Min/Max length validation
  if (isValid && input.hasAttribute('minlength')) {
    const minLength = parseInt(input.getAttribute('minlength'));
    if (input.value.length < minLength) {
      isValid = false;
      errorMessage = `Minimum length is ${minLength} characters`;
    }
  }
  
  if (isValid && input.hasAttribute('maxlength')) {
    const maxLength = parseInt(input.getAttribute('maxlength'));
    if (input.value.length > maxLength) {
      isValid = false;
      errorMessage = `Maximum length is ${maxLength} characters`;
    }
  }

  // Update UI
  if (errorEl) {
    errorEl.textContent = errorMessage;
    errorEl.style.display = errorMessage ? 'block' : 'none';
  }
  
  if (isValid) {
    input.classList.remove('form__input--error');
  } else {
    input.classList.add('form__input--error');
  }

  return isValid;
}

// Clear field error
function clearFieldError(input) {
  const errorEl = document.getElementById(`${input.id}-error`);
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
  input.classList.remove('form__input--error');
}

// Submit order
async function submitOrder(form) {
  const formData = new FormData(form);
  const orderData = {
    email: formData.get('email'),
    phone: formData.get('phone'),
    courseName: formData.get('courseName'),
    cardNumber: formData.get('cardNumber'),
  };

  try {
    await window.orderService.createOrder(orderData);
    
    // Clear selected course
    localStorage.removeItem('selectedCourse');
    
    // Redirect to thank you page
    window.location.href = '/thank-you';
  } catch (error) {
    console.error('Error submitting order:', error);
    alert('Error submitting order. Please try again.');
  }
}

// Render course card
function renderCourseCard(course) {
  const stars = '★'.repeat(course.rating || 5);
  // Map course titles to image files
  const imageMap = {
    'QA engineer': '/images/qa.jpg',
    'Front-end developer': '/images/frontend.jpg',
    'UI/UX designer': '/images/ui-ux.jpg',
    'Data Analyst': '/images/data-analyst.png'
  };
  const imageSrc = imageMap[course.title] || course.image || '/images/courses/default.jpg';
  
  return `
    <article class="course-card" role="listitem" data-course-id="${course.id}">
      <div class="course-card__badge">${course.duration}</div>
      <img 
        src="${imageSrc}" 
        alt="${course.title} course illustration" 
        class="course-card__image"
        loading="lazy"
      >
      <div class="course-card__content">
        <h3 class="course-card__title">${course.title}</h3>
        <div class="course-card__rating" aria-label="Rating: ${course.rating} out of 5 stars">
          ${stars}
        </div>
      </div>
    </article>
  `;
}

// Attach course card click handlers
function attachCourseCardHandlers() {
  const cards = document.querySelectorAll('.course-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const courseId = card.dataset.courseId;
      if (courseId) {
        window.location.href = `/course/${courseId}`;
      }
    });
  });
}

