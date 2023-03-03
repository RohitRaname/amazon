import { patch } from '../../../../../../Controller/api/api.js';
import PositionEl from '../../../../../Common/PositionComponent/base.js';
export default class SetProfileImgsDropdownView extends PositionEl {
  _parentel = document.querySelector(
    '.positionel[data-positionel-name="set-userprofile-imgs"]'
  );

  _generateMarkup(imgField,imgSet) {
    return `
            <label for="${imgField}" class="pointer list-item p-sl"
                >Upload</label
                >
                ${
                  imgSet?
                  `<li
                    data-action="delete"
                    data-field="${imgField}"
                    class="pointer list-item p-sl"
                    >
                    Delete
                  </li>
                  `:""
                }
                `;
  }

  render(positionbtnel) {
    const parentContentEl = this._parentel.querySelector('.positionel-content');

    let html;
    const {inputId,imgSet}=positionbtnel.dataset
    html = this._generateMarkup(inputId,this.boolean_converter(imgSet));

    parentContentEl.innerHTML = html;
  }

  _handle_el(target) {
    const deleteEl = target.closest('li[data-action="delete"]');
    if (!deleteEl) return;

    const { field } = deleteEl.dataset;
    patch(`users/me`, { [`profile.${field}`]: field === 'pic' ? 'default.png' : 'default_cover.png' });

    document.querySelector(`img[data-input-id="${field}"]`).src = `/img/users/${
      field === 'pic' ? 'default.png' : 'default_cover.png'
    } `;

    this.hide(this._parentel, 'click');
  }
}
