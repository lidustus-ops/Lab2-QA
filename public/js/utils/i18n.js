// i18n utility for internationalization
// Uses data-i18n attributes for translation keys

class I18n {
  constructor() {
    this.translations = {
      uk: {
        'site.title': 'IT Courses',
        'menu.toggle': 'Відкрити меню',
        'menu.title': 'Меню',
        'menu.home': 'Головна',
        'menu.courses': 'Курси',
        'button.signup': 'Реєстрація',
        'button.buy': 'Купити',
        'button.pay': 'Оплатити',
        'home.hero.title': 'IT Courses',
        'home.promo.title': 'Хочете покращити свої IT навички?',
        'home.promo.description': 'Практичні курси та реальні проєкти, призначені для розвитку вашої кар\'єри з IT Courses.',
        'home.trending.title': 'Популярні курси:',
        'statistics.teachers': '100+ викладачів',
        'statistics.satisfied': '95% задоволених учнів',
        'statistics.courses': '100% актуальні курси',
        'statistics.students': '1500+ учнів щороку',
        'catalog.title': 'Каталог IT Курсів',
        'catalog.subtitle': 'Почніть навчання сьогодні та виведіть свою IT кар\'єру на новий рівень.',
        'catalog.search.placeholder': 'Пошук курсів...',
        'catalog.filter.all': 'Всі категорії',
        'catalog.filter.technical': 'Технічні',
        'catalog.filter.nonTechnical': 'Нетехнічні',
        'catalog.sort.title': 'Сортувати за назвою',
        'catalog.sort.price': 'Сортувати за ціною',
        'catalog.sort.duration': 'Сортувати за тривалістю',
        'catalog.category.technical': 'Технічні',
        'catalog.category.nonTechnical': 'Нетехнічні',
        'course.goals.title': 'Цілі курсу:',
        'course.who.title': 'Хто такий',
        'checkout.title': 'Оформлення замовлення',
        'checkout.email.label': '1. Введіть ваш email',
        'checkout.email.placeholder': 'email@example.com',
        'checkout.phone.label': '2. Введіть ваш номер телефону',
        'checkout.phone.placeholder': '+380991234567',
        'checkout.course.label': '3. Введіть назву обраного курсу',
        'checkout.course.placeholder': 'Назва курсу',
        'checkout.card.label': '4. Введіть номер картки',
        'checkout.card.placeholder': '1234567890123456',
        'thankyou.title': 'Дякуємо за ваше замовлення!',
        'thankyou.message': 'Вся подальша інформація буде надіслана на вашу електронну пошту.',
        'contact.email': 'itcourse@gmail.com',
        'contact.phone': '+380995432121',
        'contact.instagram': '@itcourse',
      },
      en: {
        'site.title': 'IT Courses',
        'menu.toggle': 'Open menu',
        'menu.title': 'Menu',
        'menu.home': 'Home',
        'menu.courses': 'Courses',
        'button.signup': 'Sign up',
        'button.buy': 'Buy',
        'button.pay': 'Pay',
        'home.hero.title': 'IT Courses',
        'home.promo.title': 'Looking to level up your IT skills?',
        'home.promo.description': 'Practical courses and real projects designed to boost your career with IT Courses.',
        'home.trending.title': 'Trending courses:',
        'statistics.teachers': '100+ teachers',
        'statistics.satisfied': '95% satisfied students',
        'statistics.courses': '100% up-to-date courses',
        'statistics.students': '1500+ students annually',
        'catalog.title': 'IT Courses Catalog',
        'catalog.subtitle': 'Start learning today and take your IT career to the next level.',
        'catalog.search.placeholder': 'Search courses...',
        'catalog.filter.all': 'All categories',
        'catalog.filter.technical': 'Technical',
        'catalog.filter.nonTechnical': 'Non-technical',
        'catalog.sort.title': 'Sort by title',
        'catalog.sort.price': 'Sort by price',
        'catalog.sort.duration': 'Sort by duration',
        'catalog.category.technical': 'Technical',
        'catalog.category.nonTechnical': 'Non-technical',
        'course.goals.title': 'Course Goals:',
        'course.who.title': 'Who is',
        'checkout.title': 'Checkout',
        'checkout.email.label': '1. Enter your email',
        'checkout.email.placeholder': 'email@example.com',
        'checkout.phone.label': '2. Enter your phone number',
        'checkout.phone.placeholder': '+1234567890',
        'checkout.course.label': '3. Enter name of selected course',
        'checkout.course.placeholder': 'Course name',
        'checkout.card.label': '4. Enter the card number',
        'checkout.card.placeholder': '1234567890123456',
        'thankyou.title': 'Thank you for your purchase!',
        'thankyou.message': 'All further information will be sent to your email.',
        'contact.email': 'itcourse@gmail.com',
        'contact.phone': '+380995432121',
        'contact.instagram': '@itcourse',
      },
    };
    
    this.currentLang = this.detectLanguage();
    this.init();
  }

  detectLanguage() {
    // Get language from HTML data attribute or browser
    const htmlLang = document.documentElement.getAttribute('data-lang') || 
                     document.documentElement.getAttribute('lang') ||
                     navigator.language.split('-')[0];
    
    return htmlLang === 'uk' ? 'uk' : 'en';
  }

  init() {
    // Translate all elements with data-i18n attribute
    this.translatePage();
    
    // Watch for language changes
    this.observeLanguageChanges();
  }

  translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (translation) {
        if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
          element.placeholder = translation;
        } else if (element.tagName === 'INPUT' && element.hasAttribute('data-i18n-placeholder')) {
          element.placeholder = this.t(element.getAttribute('data-i18n-placeholder'));
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  t(key) {
    return this.translations[this.currentLang]?.[key] || key;
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      document.documentElement.setAttribute('data-lang', lang);
      document.documentElement.setAttribute('lang', lang);
      this.translatePage();
    }
  }

  observeLanguageChanges() {
    // Watch for changes in data-lang attribute
    const observer = new MutationObserver(() => {
      const newLang = document.documentElement.getAttribute('data-lang');
      if (newLang && newLang !== this.currentLang) {
        this.setLanguage(newLang);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-lang', 'lang'],
    });
  }
}

// Initialize i18n
const i18n = new I18n();
window.i18n = i18n;

