import { del, patch, post } from '../../../../Controller/api/api.js';
import PageView from '../../../Common/pageView.js';
import { alertError } from '../../../../Controller/Components/Alert/alertController.js';

export default class CheckoutPageView extends PageView {
  _pageEl = document.querySelector('body[data-page="checkout"]');
  _parentel = document.querySelector('.section-checkout');

  _addressStepContainerEl = this._parentel.querySelector(
    '.checkout-step[data-step-window="address"]'
  );

  _setAddressBtns = [
    ...this._parentel.querySelectorAll('button[data-action="set-address"]'),
  ];
  _useSetAddressBtn = this._parentel.querySelector(
    'button[data-action="use-set-address"]'
  );

  _orderBtns = [
    ...this._parentel.querySelectorAll('button[data-action="order"]'),
  ];

  _shoppingCartId = this._parentel.dataset.shoppingCartId;
  // left container
  _checkoutItems = [...this._parentel.querySelectorAll('.checkout-item')];

  _checkoutTotalAmountEls = [
    ...this._parentel.querySelectorAll('[data-checkout-total-amount]'),
  ];

  // header

  _changeStepWindow(stepContainerEl) {
    let stepSet = stepContainerEl.getAttribute('data-step-set');
    stepSet = stepSet === 'true' ? false : true;

    stepContainerEl.setAttribute('data-step-set', stepSet);

    const setInfoWindow = stepContainerEl.querySelector(
      '[data-window="set-info"]'
    );
    const previewSetInfoWindow = stepContainerEl.querySelector(
      '[data-window="preview-set-info"]'
    );

    setInfoWindow.classList.toggle('hidden');
    previewSetInfoWindow.classList.toggle('hidden');

    // this._stepContainerEl.querySelector('[data-window="preview-set-info"]').classList.add('hidden')
  }
  async _handleAddressStep(target, stepContainerEl) {
    // set address
    if (target.closest('[data-action="use-set-address"]')) {
      this._changeStepWindow(stepContainerEl);
    }

    // change window from
    if (target.closest('button[data-action="change-step-window"]'))
      this._changeStepWindow(stepContainerEl);

    if (
      target.closest('[data-action="use-set-address"]') ||
      target.closest('button[data-action="change-step-window"]')
    ) {
      const data = JSON.parse(
        this._parentel.querySelector(
          '.btn-checkbox[data-active="true"][data-address]'
        ).dataset.data
      );

      stepContainerEl.dataset.data = JSON.stringify(data);

      // await patch(`users/me/shopping/order/${this._orderId}`, data);
      const addressEl = stepContainerEl.querySelector(
        '.checkout-step-selected-option'
      );
      addressEl.innerHTML = '';
      const { name, address } = data.shipping;

      console.log([name, ...address.split(',')]);
      addressEl.innerHTML = '';
      const html = [name, ...address.split(',')]
        .map((el) => `<p>${el}</p>`)
        .join('');

      addressEl.insertAdjacentHTML('afterbegin', html);

      const previewWindowContentEL = stepContainerEl.querySelector(
        '.checkout-step-preview-content'
      );

      previewWindowContentEL.classList.remove('hidden');
    }
  }

  _setDeliveryAddress(target) {
    const setAddressBtn = target.closest('button[data-action="set-address"]');
    if (setAddressBtn) {
      const address = JSON.parse(setAddressBtn.dataset.data);

      this._addressStepContainerEl.dataset.data = JSON.stringify(address);
      this._useSetAddressBtn.dataset.data = JSON.stringify(address);

      this._setAddressBtns.forEach(
        (btn) => (btn.dataset.active = setAddressBtn === btn)
      );
    }
  }

  async _updateCheckoutTotalAmount() {
    this._checkoutItems = [
      ...this._parentel.querySelectorAll('.checkout-item'),
    ];
    const amount = this._checkoutItems
      .reduce((acc, el) => {
        const data = JSON.parse(el.dataset.data);
        const price = Number(data.price) * Number(data.qty);
        return acc + price;
      }, 0)
      .toFixed(2);

    const convertedAmount = (amount * Number(this._userCurrencyRate)).toFixed(
      2
    );
    console.log(convertedAmount);
    this._checkoutTotalAmountEls.forEach(
      (el) => (el.textContent = convertedAmount)
    );
    this._orderBtns.forEach((btn) => (btn.dataset.totalAmount = amount));

    this._checkoutItems.length === 0
      ? this._orderBtns.forEach((el) => el.classList.add('btn-disabled'))
      : this._orderBtns.forEach((el) => el.classList.remove('.btn-disabled'));

    if (this._checkoutItems.length === 0) {
      await patch(`users/me/shopping/cart/${this._shoppingCartId}/rollback`);
      setTimeout(() => {
        location.assign('/me/cart');
      }, 1000);
    }

    this._checkoutTotalAmountEls.forEach(
      (el) => (el.textContent = convertedAmount)
    );
  }

  _checkoutErrorHandler(error) {
    if (error.status === 'error' && error.message === 'cart expired') {
      [...this._parentel.querySelectorAll('button')].forEach((btn) =>
        btn.classList.add('btn-disabled')
      );

      this._parentel.classList.add('no-click');
      alertError({ title: 'Cart Expired! Please try  checkout again' });
    } else {
      alertError({ title: error.message });
    }
    document.documentElement.scrollHeight = 0;
    setTimeout(() => location.assign('/me/cart', 4000));
  }

  async deleteCheckoutItem(data) {
    const { itemEl, qty } = data;

    console.log(data);
    const checkoutItemData = JSON.parse(itemEl.dataset.data);

    const { _id } = checkoutItemData;
    const res = await del(
      `users/me/shopping/cart/${this._shoppingCartId}/item/${_id}/qty/${qty}`,
      false,
      false,
      true
    );

    if (res && res.status === 'error') return this._checkoutErrorHandler(res);

    itemEl.remove();
    this._updateCheckoutTotalAmount();
  }
  updateCheckoutItemQty(data) {
    const { itemEl, newQty, delta } = data;
    const cartItemData = JSON.parse(itemEl.dataset.data);
    const res = patch(
      `users/me/shopping/cart/${this._shoppingCartId}`,
      { newQty, delta, _id: cartItemData._id },
      false,
      true
    );

    if (res && res.status === 'error') return this._checkoutErrorHandler(res);
    itemEl.dataset.data = JSON.stringify({
      ...cartItemData,
      qty: newQty,
    });

    this._updateCheckoutTotalAmount();
  }

  add_handler_el() {
    this._pageEl.addEventListener('click', async (e) => {
      const target = e.target;

      if (target.closest('[data-step-window="address"]')) {
        const stepContainerEl = target.closest('.checkout-step');
        this._handleAddressStep(target, stepContainerEl);
      }

      if (target.closest('button[data-action="order"]')) {
        this._orderBtns.forEach((el) => el.classList.add('btn-disabled'));
        let data = {};

        [...this._parentel.querySelectorAll('.checkout-step')].forEach((el) => {
          if (el.hasAttribute('data-data'))
            data = { ...data, ...JSON.parse(el.getAttribute('data-data')) };
          data.cartId = this._shoppingCartId;
        });

        data.summary = {
          totalAmount: this._orderBtns[0].dataset.totalAmount,
        };

        console.log(data);

        const res = await post(
          `users/me/shopping/order/cart/${this._shoppingCartId}`,
          data,
          false,
          true
        );
        if (res && res.status === 'error')
          return this._checkoutErrorHandler(res);

        location.assign('/me/orders');
      }

      this._setDeliveryAddress(target);
    });
  }
}
