class HeaderView {
  _parentel = document.querySelector('.header');

  add_handler_header() {
    this._parentel.addEventListener('click', (e) => {
      const target = e.target;
    });
  }
}
