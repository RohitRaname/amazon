import PositionElView from './base.js';

export default class DropdownView extends PositionElView {
  _parentel;
  _listEl;

  _list_item_els;

  _parentElCommonData;

  // change positiontbtn el / if textel => textcontent / input => value
  changePositionbtnelTextOrValue = false;

  // active select dropdown item
  _activeSelectItem;

  // task done by the selected dropdown
  _parentElAction;


  

  // set initiallly dom els & variable for specified dropdown
  _additional_funcs(target) {

    this._listEl= this._parentel.querySelector('.list')

    const { changePositionbtnelTextOrValue, activeSelectItem, action, commonData } =
      this._parentel.querySelector('.list').dataset;

    this.changePositionbtnelTextOrValue = changePositionbtnelTextOrValue === 'true';
    this._parentElAction = action;
    this._activeSelectItem = activeSelectItem === 'true';
    this._parentElCommonData = commonData;

    this._list_item_els = [...this._parentel.querySelectorAll('.list-item')];
  }

  _handle_el(target, handle) {
    console.log('dropdown-entered')
    const list_item = target.closest('.list-item');

    if (!list_item) return;
    // 0.if dropdown item clicked,pass the value and hide dropdown
    let { data, differentAction } = list_item.dataset;

    const submitData = {
      ...JSON.parse(data),
      ...JSON.parse(this._parentElCommonData),
    };

    // mark list-item
    if (this._activeSelectItem)
      this._activeel_in_arr(list_item, this._list_item_els);

    // if displayed using positionbtnel
    if (this.changePositionbtnelTextOrValue){
      const type= this._positionbtn_el.nodeName.toLowerCase();

      if(type==="input") this._positionbtn_el.vaue= list_item.textContent;
      else      this._positionbtn_el.querySelector('p').textContent =
      list_item.textContent;
    }

    console.log(this._parentElAction, submitData);

    this.hide();

    if (handle) return handle(this._parentElAction, submitData);
  }
}
