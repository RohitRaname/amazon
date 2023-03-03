import ModalView from './ModalView.js';
import { alertError } from '../../../Controller/Components/Alert/alertController.js';
import { post, patch } from '../../../Controller/api/api.js';
import { closest } from '../../utils/domHelper.js';
import { breakNestedObjIntoTopField } from '../../utils/helper.js';

class FormView extends ModalView {
  _parentel;
  _form;

  // form attributes
  _submitFormAutomatic;
  _redirectTo;
  _url;
  _method;
  _additionalData;

  // parentel can be formel or formel inside parentel
  // when there is formel only, then parentel === formel
  // when formel inside parentel,then formel and parentel are different

  render() {}

  _get_inputs() {
    return [...this._form.querySelectorAll('[data-input]')];
  }

  _reset_inputs() {
    if (this._form.getAttribute('data-clear-inputs-when-hide') !== 'true')
      return;

    this._form.dataset.error = false;

    [
      ...this._form.querySelectorAll('input'),
      ...this._form.querySelectorAll('textarea'),
      ...this._form.querySelectorAll('img'),
    ].forEach((el) => {
      const el_type = el.tagName.toLowerCase();

      if (el_type === 'input')
        ['value', 'defaultValue'].forEach((field) => (el[field] = ''));
      else if (el_type === 'textarea') {
        ['value', 'defaultValue'].forEach((field) => (el[field] = ''));
        el.textContent = '';
      } else if (el_type === 'img' && el.getAttribute('data-reset') !== 'false')
        el.src = '';

      if (el_type === 'input' || el_type === 'textarea') {
        const form_group = el.closest('.form-group');
        if (form_group) form_group.dataset.error = false;
      }
    });
  }

  _checkEmail(value) {
    if (value.length === 0) return true;

    if (!value.includes('@gmail.com' || '.io' || '.com')) return true;

    return false;
  }

  _get_submit_data() {
    if (!this._form) return;

    this._updateInputAndFormState(null, true);
    const inputs = this._get_inputs();

    const data_submit = { error: false, data: {} };

    inputs.forEach((input) => {
      // img input-el
      if (input.files && input.files.length > 0) {
        if (!data_submit.data[input.name]) data_submit.data[input.name] = [];
        data_submit.data[input.name].push(...input.files);
      } else if (input.getAttribute('data-set-value'))
        data_submit.data[input.name] = input.getAttribute('data-set-value');
      else if (input.value === '' && input.value !== input.defaultValue)
        data_submit.data[input.name] = input.defaultValue;
      else if (input.value !== '') data_submit.data[input.name] = input.value;

      if (input.getAttribute('data-same-value-as-input')) {
        const compareInput = this._form.querySelector(
          `input[name="${input.getAttribute('data-same-value-as-input')}"]`
        );

        const error = !(compareInput.value === input.value);
        data_submit.error = error;

        this._form.dataset.error = error;

        input.closest('.form-group').dataset.error = error;
      }

      // same value input(password and anotherpassword value should be same)
    });

    data_submit.error = this.boolean_converter(this._form.dataset.error);

    ///////////////////////////////////
    // add additional data that db need outside of form inputs (like ques ,we need author and product details also)

    data_submit.data = { ...data_submit.data, ...this._additionalData };

    console.log('data-submit', data_submit);
    data_submit.data = breakNestedObjIntoTopField(data_submit.data);

    return data_submit;
  }

  _get_submitdata_as_formdata_format() {
    const { data, error } = this._get_submit_data();
    if (error) return;

    const formdata = new FormData();
    Object.keys(data).forEach((key) => {
      if (key.includes('photo'))
        return data[key].forEach((file) => formdata.append(key, file));

      formdata.append(key, data[key]);
    });

    return { data: formdata, error };
  }

  _manuallyCheckInput(input) {}

  // shows error if required input has no value
  _updateInputAndFormState(e, submit = false) {
    console.log('entering on form');
    if (this._form.dataset.optional === 'true') return;

    let error_el;

    const form_groupels = [...this._form.querySelectorAll('.form-group')];

    form_groupels.forEach((groupel) => {
      const { required } = groupel.dataset;
      const input = groupel.querySelector('[data-input]');
      const value = groupel.querySelector('[data-input]').value;
      if (input.type === 'file' || (required === 'false' && value === ''))
        return;

      let error = false;

      if (input.type === 'email') error = this._checkEmail(value);
      else if (input.getAttribute('data-manually-check') === 'true')
        error = this._manuallyCheckInput(input);
      else
        error =
          value.length === 0 ||
          (input.minLength && Number(input.minLength) > value.length);

      if (error && !submit) return;

      groupel.dataset.error = error;

      if (groupel.dataset.error === 'true') error_el = groupel;
    });

    this._form.dataset.error = error_el ? true : false;
  }

  // Handle 5
  _clickOnDropdownInput(target) {
    const groupEl = closest(target, 'form-dropdown-group');
    if (!groupEl) return;
    const dropdown = target.closest('.dropdown');
    const label = groupEl.querySelector('.form-label');
    const dropDownItem = closest(target, 'list-item');

    if (!dropDownItem) return;
    groupEl.dataset.error = false;
    const value = dropDownItem.textContent.trim();

    const groupInputEl = target
      .closest('.form-group')
      .querySelector('[data-input]');

    groupInputEl.value = value;
    label.textContent = value;
    dropdown.dataset.active = false;

    const allDropdownEls = [...groupEl.querySelectorAll('.list-item')];

    allDropdownEls.forEach((el) => (el.dataset.active = el === dropDownItem));
  }

  // handle 6
  _update_submitbtn_state() {}

  _auto_increase_textareaels_height() {
    // global delegated event listener

    const textarea_inputels = [...this._form.querySelectorAll('textarea')];

    textarea_inputels.forEach((textareael) => {
      const initial_height = textareael.clientHeight;
      let previous_no_of_lines = 0;

      textareael.addEventListener('input', () => {
        if (textareael.value === '')
          textareael.style.height = initial_height + 'px';

        const cur_no_of_lines = Math.floor(
          (textareael.scrollHeight - initial_height) / 22
        );

        if (cur_no_of_lines === previous_no_of_lines) return;

        textareael.style.height = 'auto';

        const decrease_or_increase_in_height =
          cur_no_of_lines > previous_no_of_lines
            ? textareael.clientHeight / (cur_no_of_lines + 2)
            : -textareael.clientHeight / (cur_no_of_lines + 2);
        previous_no_of_lines = cur_no_of_lines;

        // textareael.style.height = textareael.scrollHeight + 'px';
        textareael.style.height =
          textareael.clientHeight + decrease_or_increase_in_height + 'px';
      });
    });
  }

  // can alter the submit data (add positionBtndata to submit data)
  _beforeSubmitAddCode(data) {}

  // decide how to hide the element
  _afterSubmitAddCode(data) {}

  async _submit(handle) {
    this._initialSetFormDOMElsAndAttrs();
    const result =
      this._form.getAttribute('data-multi-formdata') === 'true'
        ? this._get_submitdata_as_formdata_format()
        : this._get_submit_data();

    if (!result) return;
    const { data, error } = result;
    if (error) return;

    // check for some error or update some component
    this._beforeSubmitAddCode(data);

    // automatic data submit
    if (!this._submitFormAutomatic) {
      handle('submit-data', data);
      this.hide('click', this._parentel);
      return;
    } else {
      let res;
      if (this._method === 'post')
        res = await post(this._url, data, this.redirectTo, true);
      else if (this._method === 'patch')
        res = await patch(this._url, data, this.redirectTo, true);
      // if(res.status.startsWith('4') || res.status.startsWith('5'))

      // return alertError('Error occurred during submitting! Please resumbit again');
      // return;
    }

    if (this._parentel.getAttribute('data-hide-form-after-submit') === 'true')
      this._parentel.dataset.static === 'true' ? this._reset() : this.hide();

    // to add after submit the form
    this._afterSubmitAddCode(data);

    // redirect the page
    if (this._form.getAttribute('data-redirect-to'))
      location.assign(this._form.getAttribute('data-redirect-to'));
  }

  _submit_data_by_enter_btn(handle) {
    this._form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();

        this._submit(handle);
      }
    });
  }

  _click_on_btns(target, handle) {
    if (target.closest('button[data-action="cancel"]')) this.hide();

    if (target.closest('button[data-action="submit"]')) this._submit(handle);
  }

  _uploadEvent(e) {
    const photoInputEl = e.target.closest('input');
    // const limit = Number(photoInputEl.dataset.maxPhoto);

    // const files = [...photoInputEl.files].slice(0, limit);
    // show error if exceed limit

    const file = photoInputEl.files[0];

    // curUploadPhotoEls ----------------
    const form_groupel = photoInputEl.closest('.form-group');
    const photoPreviewUploadPhotoEl = form_groupel.querySelector(
      `.form-preview-upload-photo[data-input-id="${photoInputEl.id}"]`
    );
    const photoEl = photoPreviewUploadPhotoEl.querySelector('img');
    const formInputContainer = form_groupel.querySelector('.form-group-inputs');
    const formPreviewUploadPhotoContainer = form_groupel.querySelector(
      '.form-preview-upload-photos'
    );
    const photoLabel = form_groupel.querySelector(
      `label[for="${photoInputEl.id}"]`
    );

    // newPhotoUploadEls insert ----------------------------
    const newPhotoInputElId = `photo-${
      Number(photoInputEl.id.split('-')[1]) + 1
    }`;
    // preparation for next upload img
    // 1.update label for-attr
    photoLabel.setAttribute('for', newPhotoInputElId);

    // 2.set preview-photoEl
    formPreviewUploadPhotoContainer.insertAdjacentHTML(
      'beforeend',
      `  
      <div class="form-preview-upload-photo hidden" data-input-id="${newPhotoInputElId}">
          <button
            class="btn-icon btn-icon-lw round"
            data-action="remove-upload-photo"
          >
            <i class="fa fa-close"></i>
          </button>
          <img src="" data-reset="true" class="" alt="" />
      </div>`
    );

    // 3.insert new inputEl
    formInputContainer.insertAdjacentHTML(
      'beforeend',
      `       <input
      type="file"
      id="${newPhotoInputElId}"
      name="${photoInputEl.name}"
      class="hidden"
      accept="image/*"
      data-max-photo="1"
      data-input
    />`
    );

    // 4.setting upload event on new created inputel
    form_groupel
      .querySelector(`input[id="${newPhotoInputElId}"]`)
      .addEventListener('change', this._uploadEvent.bind(this));

    photoPreviewUploadPhotoEl.classList.remove('hidden');

    photoEl.src = URL.createObjectURL(file);

    // when img load in upload_img el (src store)
    photoInputEl.addEventListener('load', () =>
      URL.revokeObjectURL(photoInputEl.src)
    );
  }

  _previewUploadPhoto() {
    const photoInputEls = [...this._form.querySelectorAll('[type="file"]')];

    photoInputEls.forEach((photoInputEl) => {
      photoInputEl.addEventListener('change', this._uploadEvent.bind(this));
    });
  }

  _clickOnPhotoGroupEl(target, handle) {
    // click on remove preview upload img button
    if (target.closest('button[data-action="remove-upload-photo"]')) {
      const previewPhotoEl = target.closest('.form-preview-upload-photo');

      const photoInputEl = this._parentel.querySelector(
        `input[id="${previewPhotoEl.dataset.inputId}"]`
      );

      previewPhotoEl.remove();
      if (photoInputEl.id !== 'photo-1') photoInputEl.remove();
    }
  }

  _handleCheckBox(target) {
    if (target.closest('.btn-checkbox')) {
      const checkbox = target.closest('.btn-checkbox');
      const checkboxGroupEl = checkbox.closest('.form-checkbox-group');
      const inputEl = checkboxGroupEl.querySelector('input');

      const active = checkbox.dataset.active === 'true' ? false : true;

      checkbox.dataset.active = active;
      inputEl.value = active;
    }
  }

  _additional_click_on_form(target, handle) {}

  // Main function
  _click_on_form(target, handle) {
    console.log('click on form');
    // this._updateInputAndFormState();
    this._click_on_btns(target, handle);

    this._clickOnPhotoGroupEl(target, handle);

    this._clickOnDropdownInput(target);

    this._handleCheckBox(target);

    this._additional_click_on_form(target, handle);
  }

  // PUBLIC FUNCTION *********************************
  _handle_el(target, handle) {
    this._click_on_form(target, handle);
    this._hideChildPositionElWhenNotInteracting(target)
  }

  _additional_form_funcs() {}

  _initialSetFormDOMElsAndAttrs() {
    if (!this._form) this._form = this._parentel;

    const { url, method, submitAutomatic, data, redirectTo } =
      this._form.dataset;
    if (!method) return;
    this._submitFormAutomatic = this.boolean_converter(submitAutomatic);
    this._url = url;
    this._method = method;
    this._additionalData = JSON.parse(data);
    this._redirectTo = redirectTo;


    this._parentElHasChildPositionEl =
    this._parentel.getAttribute('data-has-child-positionel') === 'true';
  }

  _additional_funcs(handle) {
    this._initialSetFormDOMElsAndAttrs();

    this._reset_inputs();

    this._form.addEventListener(
      'input',
      this._updateInputAndFormState.bind(this)
    );

    this._submit_data_by_enter_btn(handle);
    // this._auto_increase_textareaels_height();
    this._previewUploadPhoto();

    this._additional_form_funcs();
  }

  _updateInputWordCount(inputEl, countEl) {
    inputEl.addEventListener('input', (e) => {
      const count = e.target.value.trim().length;
      countEl.textContent = count;
    });
  }

  enableUserToSeePasswordTyped(seePasswordBtn, passwordInput) {
    seePasswordBtn.addEventListener('click', () => {
      let { active } = seePasswordBtn.dataset;

      active = active === 'false' ? true : false;

      seePasswordBtn.dataset.active = active;

      active === true
        ? passwordInput.setAttribute('type', 'text')
        : passwordInput.setAttribute('type', 'password');
    });
  }

  checkIfNewPasswordMeetMinRequirements(passwordInput, passwordGroupEl) {
    passwordInput.addEventListener('input', () => {
      const length = passwordInput.value.trim().length;

      passwordGroupEl.dataset.error = length < 8 ? true : false;
    });
  }
}

export default FormView;
