export default class TooltipView {
  _clickel = document.documentElement;
  _allParentEls = [...document.querySelectorAll('[data-tooltip-trigger-el]')];

  constructor() {
    this.handleAllToolTipEls();
  }

  handleAllToolTipEls() {
    document.documentElement.addEventListener('click', (e) => {
      const target = e.target;
      if (target.closest('.tooltip')) return;
      if (target.closest('.tooltip-closebtn'))
        return (el.dataset.active = false);

      const tooltipClicked = target.closest('[data-tooltip-trigger-el]');
      if (tooltipClicked) tooltipClicked.dataset.active = true;

      if (!tooltipClicked) {
        this._allParentEls.forEach(
          (tooltopEl) => (tooltopEl.dataset.active = false)
        );
      }
    });
  }
}
