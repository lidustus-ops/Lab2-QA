// Menu Component
class Menu {
  constructor() {
    this.menuToggle = document.getElementById('menuToggle');
    this.menuOverlay = document.getElementById('menuOverlay');
    this.menuClose = document.getElementById('menuClose');
    this.isOpen = false;
    
    this.init();
  }

  init() {
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.open());
    }

    if (this.menuClose) {
      this.menuClose.addEventListener('click', () => this.close());
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Close on overlay click
    if (this.menuOverlay) {
      this.menuOverlay.addEventListener('click', (e) => {
        if (e.target === this.menuOverlay) {
          this.close();
        }
      });
    }
  }

  open() {
    if (this.menuOverlay) {
      this.menuOverlay.classList.remove('hidden');
      // Blur effect removed - no page-overlay class
      this.isOpen = true;
      
      // Focus management
      const firstLink = this.menuOverlay.querySelector('a');
      if (firstLink) {
        firstLink.focus();
      }
    }
  }

  close() {
    if (this.menuOverlay) {
      this.menuOverlay.classList.add('hidden');
      // Blur effect removed - no page-overlay class
      this.isOpen = false;
      
      // Return focus to menu toggle
      if (this.menuToggle) {
        this.menuToggle.focus();
      }
    }
  }
}

// Initialize menu when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Menu();
  });
} else {
  new Menu();
}

// Menu is auto-initialized

