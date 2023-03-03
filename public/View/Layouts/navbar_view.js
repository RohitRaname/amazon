export default class navbar_view {
  _parentel = document.querySelector('.nav');
  _mobile_nav_btn = document.querySelector('.nav-btn-box');

  add_handler_page(handle) {}
  add_handler_nav(handle) {
    this._mobile_nav_btn.addEventListener('click', (e) => {
      document.documentElement.style.overflowY = 'hidden';

      this._parentel.dataset.active = true;
    });

    this._parentel.addEventListener('click', (e) => {
      const target = e.target;

      if (
        target.closest('button[data-action="close-nav"]') ||
        target.closest('.overlay')
      ) {
        document.documentElement.style.overflowY = 'auto';
        this._parentel.dataset.active = false;
      }
    });
  }
}
