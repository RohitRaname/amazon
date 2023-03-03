import { patch, post, del } from '../../../Controller/api/api.js';

export default class ManualLinkView {
  _parentel = document.documentElement;

  add_handler_el() {
    this._parentel.addEventListener('click', (e) => {
      const target = e.target;

      const link = target.closest('.link');
      if (!link) return;

      let { method, url, data, changeTextTo, changeUrlTo } = link.dataset;
      data = data && JSON.parse(data);

      if (changeTextTo) {
        link.dataset.changeTextTo = link.textContent;
        link.textContent = changeTextTo;
      }
      if (changeUrlTo) {
        link.dataset.changeUrlTo = link.dataset.url;
        link.dataset.url = changeUrlTo;
      }
      if (method === 'patch') patch(url, data);
      if (method === 'post') post(url, data);
      if (method === 'del') del(url, data);
    });
  }
}
