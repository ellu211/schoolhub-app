/**
 * SchoolHub - Universal Modal Manager
 */

class ModalManager {
  constructor() {
    this.backdrop = null;
    this.contentEl = null;
    this.init();
  }

  init() {
    let el = document.getElementById('app-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'app-modal-backdrop';
      el.className = 'modal-backdrop';
      el.innerHTML = `
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <div class="modal-body" id="app-modal-body"></div>
        </div>
      `;
      document.body.appendChild(el);

      el.addEventListener('click', (e) => {
        if (e.target === el) {
          this.close();
        }
      });
    }
    this.backdrop = el;
    this.contentEl = el.querySelector('#app-modal-body');

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open(htmlContent, customClass = '') {
    if (!this.backdrop) this.init();
    this.contentEl.innerHTML = htmlContent;
    const dialog = this.backdrop.querySelector('.modal-dialog');
    dialog.className = 'modal-dialog ' + customClass;
    this.backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.backdrop) {
      this.backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (this.contentEl) this.contentEl.innerHTML = '';
      }, 250);
    }
  }

  isOpen() {
    return this.backdrop && this.backdrop.classList.contains('is-open');
  }
}

window.appModal = new ModalManager();
