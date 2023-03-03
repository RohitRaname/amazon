import PositionElView from '../../Common/PositionComponent/base.js';

class UserOptionsDropdown extends PositionElView {
  _parentel = document.querySelector(
    '.dropdown[data-positionel-name="user-options"]'
  );
  _positionbtn_el = document.querySelector(
    '[data-positionel-btn][data-positionel-name="user-options"]'
  );

  set_position_of_el() {
    const { top, right, height } = this._positionbtn_el.getBoundingClientRect();
    this._parent_containerel.style.top =
      top + height + document.documentElement.scrollTop + 'px';
    this._parent_containerel.style.left =
      right - this._parent_containerel.clientWidth * 0.9 + 'px';
  }
  // additional_funcs(){
  //   this.hover_on_positionbtnel()
  // }
}

export default UserOptionsDropdown;
