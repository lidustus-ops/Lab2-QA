// Paginator Component
class Paginator {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.currentPage = options.currentPage || 1;
    this.itemsPerPage = options.itemsPerPage || 6;
    this.totalItems = options.totalItems || 0;
    this.onPageChange = options.onPageChange || (() => {});
  }

  // Calculate total pages
  getTotalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Render pagination controls
  render() {
    if (!this.container) return;

    const totalPages = this.getTotalPages();
    if (totalPages <= 1) {
      this.container.innerHTML = '';
      return;
    }

    let html = '<nav class="paginator" role="navigation" aria-label="Pagination">';
    html += '<ul class="paginator__list">';

    // Previous button
    html += `<li class="paginator__item">
      <button 
        class="paginator__button ${this.currentPage === 1 ? 'disabled' : ''}" 
        ${this.currentPage === 1 ? 'disabled' : ''}
        data-page="${this.currentPage - 1}"
        aria-label="Previous page"
      >
        &laquo; Prev
      </button>
    </li>`;

    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      html += `<li class="paginator__item">
        <button class="paginator__button" data-page="1">1</button>
      </li>`;
      if (startPage > 2) {
        html += `<li class="paginator__item paginator__item--ellipsis">...</li>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      html += `<li class="paginator__item">
        <button 
          class="paginator__button ${i === this.currentPage ? 'active' : ''}" 
          data-page="${i}"
          aria-label="Page ${i}"
          ${i === this.currentPage ? 'aria-current="page"' : ''}
        >
          ${i}
        </button>
      </li>`;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        html += `<li class="paginator__item paginator__item--ellipsis">...</li>`;
      }
      html += `<li class="paginator__item">
        <button class="paginator__button" data-page="${totalPages}">${totalPages}</button>
      </li>`;
    }

    // Next button
    html += `<li class="paginator__item">
      <button 
        class="paginator__button ${this.currentPage === totalPages ? 'disabled' : ''}" 
        ${this.currentPage === totalPages ? 'disabled' : ''}
        data-page="${this.currentPage + 1}"
        aria-label="Next page"
      >
        Next &raquo;
      </button>
    </li>`;

    html += '</ul>';
    html += '</nav>';

    this.container.innerHTML = html;

    // Attach event listeners
    this.attachListeners();
  }

  // Attach event listeners to pagination buttons
  attachListeners() {
    const buttons = this.container.querySelectorAll('.paginator__button:not(.disabled)');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const page = parseInt(e.target.dataset.page);
        if (page && page !== this.currentPage) {
          this.setPage(page);
        }
      });
    });
  }

  // Set current page
  setPage(page) {
    const totalPages = this.getTotalPages();
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.render();
      this.onPageChange(page);
    }
  }

  // Update total items
  updateTotalItems(total) {
    this.totalItems = total;
    this.render();
  }
}

window.Paginator = Paginator;

