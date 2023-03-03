import PositionElView from '../../Common/PositionComponent/base.js';

class ChangeLanguageDropdownView extends PositionElView {
  _parentel = document.querySelector(
    '.dropdown[data-positionel-name="choose-language"]'
  );

  _positionbtn_el = document.querySelector(
    '[data-positionel-btn][data-positionel-name="choose-language"]'
  );

  // additional_funcs() {
  //   this.hover_on_positionbtnel();
  // }
}

export default ChangeLanguageDropdownView;
