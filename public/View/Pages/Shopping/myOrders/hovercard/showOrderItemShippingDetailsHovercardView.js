import PositionElView from '../../../../Common/PositionComponent/base.js';
export default class ShowOrderItemShippingDetailsHoverCardView extends PositionElView {
  _parentel = document.querySelector(
    '.positionel[data-positionel-name="shipping-address-in-detail"]'
  );

  render() {
    console.log('render-hovercard');
    const shipping = JSON.parse(this._positionbtn_el.dataset.data).address;
    this._parentel.querySelector('[data-value]').textContent = shipping;
  }
}
