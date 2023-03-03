import PositionElView from '../../Common/PositionComponent/base.js';

export default class ProductRatingsOverviewHovercardView extends PositionElView {
  _parentel = document.querySelector(
    '.hovercard[data-positionel-name="product-ratings-overview"]'
  );
  _positionbtn_el = document.querySelector(
    '[data-positionel-btn][data-positionel-name="product-ratings-overview"]'
  );
  _product_rating_chart = this._parentel.querySelector('.product-rating-chart');

  _reset_parentel() {
    this._product_rating_chart.dataset.race = false;
  }

  render() {
    this._product_rating_chart.dataset.race = true;
  }

  // additional_funcs() {
  //   this.hover_on_positionbtnel();
  // }
}


