export default class SlideComponentView {
  _parentel = document.documentElement;

  _slideComponentExist = document.querySelector('[data-component="slide"]');

  add_handler_el() {
    this._slideComponentExist &&
      this._parentel.addEventListener('click', (e) => {
        const target = e.target;

        // hide component
        const clickSlideComponent = target.closest('[data-component="slide"]');
        if (
          clickSlideComponent &&
          (target.closest('.overlay') ||
            target.closest('button[data-action="close"]'))
        ) {
          clickSlideComponent.dataset.active = false;

          if (clickSlideComponent.querySelector('.row-spinner')) {
            setTimeout(() => {
              clickSlideComponent
                .querySelector('.row-spinner')
                .setAttribute('data-show-spinner', true);
            }, 800);
          }

          return;
        }

        //   show component
        const slideHook = target.closest('[data-slide-hook]');
        if (!slideHook) return;

        const slideComponent = document.querySelector(
          `[data-hook-id="${slideHook.dataset.slideHook}"]`
        );
        if (!slideComponent) return;

        slideComponent.dataset.active = true;
      });
  }
}
