import FormView from '../../../../Common/PositionComponent/FormView.js';

export default class ChangeUserNameFormView extends FormView {
  _parentel =document.querySelector('.createReview-change-username-form');


  _userNameEl=this._parentel.querySelector('.createReview-user-name');
  _userBox=this._parentel.querySelector('.createReview-user-box')
  _editInputsEl = this._parentel.querySelector('.createReview-edit-inputs');


  _reset_parentel(){
    this._editInputsEl.classList.toggle('hidden');
    this._userBox.classList.toggle('hidden')
  }

  _afterSubmitAddCode(data){
    this._editInputsEl.classList.toggle('hidden');
    this._userBox.classList.toggle('hidden')

    this._userNameEl.textContent=data.name;

    
  }

  _additional_click_on_form(target) {
    if (target.closest('button[data-action="show-inputs"]')){
      this._editInputsEl.classList.toggle('hidden');
      this._userBox.classList.toggle('hidden')
    }
  }

}
