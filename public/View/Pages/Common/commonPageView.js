import { activeel } from '../../utils/domHelper.js';
import { patch, post, get } from '../../../Controller/api/api.js';

export default class CommonPageView {
  _parentel = document.querySelector('body');
  _cartItemsCount = this._parentel.querySelector('.header-cart-qty');

  add_handler_page(handle) {
    this._parentel.addEventListener('click', async (e) => {
      const target = e.target;

      if (target.closest('button[data-action="move-to-top-of-page"]')) {
        window.scrollTo(0, 0);
      }

      // button seem pressed and can click on it during the time frame
      if (target.closest('[data-click-effect]')) {
        const clickedBtn = target.closest('[data-click-effect]');

        clickedBtn.classList.add('btn-disabled');
        setTimeout(() => clickedBtn.classList.remove('btn-disabled'), 1500);
      }

      // add item to cart
      if (target.closest('[data-action="add-to-cart"][data-automatic]')) {
        const addToCartBtn = target.closest(
          '[data-action="add-to-cart"][data-automatic]'
        );

        const { clicked, checkout } = addToCartBtn.dataset;
        console.log(clicked, checkout);

        if (!clicked === 'false' || !clicked) {
          const item = JSON.parse(addToCartBtn.dataset.data);
          console.log(item);
          await post('users/me/cart', item);

          addToCartBtn.dataset.clicked = true;

          if (checkout === 'true') {
            addToCartBtn.classList.remove('btn-disabled')
              addToCartBtn.textContent = 'Proceed to checkout';
              addToCartBtn.dataset.clicked = true;
          }
        }

        if (clicked === 'true' && checkout === 'true') {
          await post('users/me/shopping/cart/checkout');
          location.assign('/me/checkout');
        }
      }

      // update cart items count in header
      if (target.closest('button[data-action="add-to-cart"]')) {
        setTimeout(async () => {
          const res = await get(`users/me/cart/items/count`);
          this._cartItemsCount.textContent = res.data.count;
        }, 1000);
      }
    });
  }
}
