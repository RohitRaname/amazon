import PositionElView from '../../../../../Common/PositionComponent/base.js';
import { setUploadImg } from '../../../../../utils/setUploadImg.js';
import { patch } from '../../../../../../Controller/api/api.js';

export default class SetProfileCoverModalView extends PositionElView {
  _parentel = document.querySelector(
    '.modal[data-positionel-name="upload-cover-photo"]'
  );

  _userProfileCoverInputEl = document.querySelector('input[id="cover_pic"]');
  _userProfileCoverImgEl = document.querySelector('.userProfile-cover-pic img');

  _handle_el(target, handle) {
    if (target.closest('button[data-action="upload"]')) {
      const formData = new FormData();
      const file = this._userProfileCoverInputEl.files[0];
      formData.append('cover_pic', this._userProfileCoverInputEl.files[0]);

      patch('users/me', formData);
      this.hide('click', this._parentel);

      setUploadImg(this._userProfileCoverImgEl, file);
    }
  }
}
