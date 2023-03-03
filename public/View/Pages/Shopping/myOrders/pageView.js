import { post } from '../../../../Controller/api/api.js';
import PageView from '../../../Common/pageView.js';

export default class MyOrdersPageView extends PageView {
  _pageEl = document.querySelector('body[data-page="myOrder"]');
  _parentel = document.querySelector('.section-myOrder');

  add_handler_el() {
    this._parentel.addEventListener('click', async (e) => {
      const target = e.target;

      if (target.closest('[data-action="add-to-cart"]')) {
        // const itemId = JSON.parse(
        //   target.closest('[data-action="add-to-cart"]').dataset.data
        // )._id;
        // post('users/me/cart', { _id: itemId });

        // show added to cart message
        const addToCartMessage = target
          .closest('.grid-item')
          .querySelector('.order-added-to-cart-message');

        setTimeout(() => {
          addToCartMessage.classList.remove('hide');
        }, 700);
      }
    });
  }
}
