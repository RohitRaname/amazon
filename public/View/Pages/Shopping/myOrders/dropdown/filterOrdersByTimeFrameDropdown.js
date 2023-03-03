import PositionElView from '../../../../Common/PositionComponent/base.js';
import { patch, del } from '../../../../../Controller/api/api.js';

export default class SetOrdersByTimeFrameDropdownView extends PositionElView {
  _parentel = document.querySelector(
    '.positionel[data-positionel-name="filter-orders-by-timeframe"]'
  );

  _handle_el(target, handle) {
    const dropdownItem = target.closest('.list-item');
    if (!dropdownItem) return;
    
        this._activeel_in_arr(dropdownItem, [
          ...this._parentel.querySelectorAll('.list-item'),
        ]);

    let timeFrameQuery;
    const { value, action } = dropdownItem.dataset;

    let [timeValue,timeStr]=value.split('-')
    timeValue=Number(timeValue)

    if(timeStr==="days"){
       
        timeFrameQuery=`ts[gt]=${new Date(new Date().setDate(-timeValue)).toISOString()}`
    }

    else 
    if(timeStr==="year"){
        timeFrameQuery=`ts[gte]=${new Date(`1/1/${timeValue}`).toISOString()}&ts[lt]=${new Date(`1/1/${timeValue+1}`).toISOString()}`
    }

    this._positionbtn_el.querySelector("[data-value]").textContent= dropdownItem.textContent;
    console.log(timeFrameQuery)



 
      handle('set-orders-timeframe-query-in-order-modal', {
          queryString:timeFrameQuery
      });

    this.hide('click', this._parentel);
  }
}
