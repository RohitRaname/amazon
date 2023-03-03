import { setUploadImg } from '../../../../utils/setUploadImg.js';
import {patch} from "../../../../../Controller/api/api.js"


export default class MyProfilePageView {
  _parentel = document.querySelector('.section-my-profile');
  _photoInputEls = [...this._parentel.querySelectorAll('[type="file"]')];

  _uploadCoverPicModalEl = document.querySelector(
    '.modal[data-positionel-name="upload-cover-photo"]'
  );
  _uploadCoverPicModalImgEl = this._uploadCoverPicModalEl.querySelector('img');

  _profileCoverInputEl = this._parentel.querySelector('input[id="cover_pic"]');

  // set upload img in imgEl

  _uploadEvent(e) {
    const photoInputEl = e.target.closest('input');
    const file = photoInputEl.files[0];

    console.log('file', file);

    // showing img in modal first
    if (photoInputEl.id === 'cover_pic') {
      setUploadImg(this._uploadCoverPicModalImgEl, file);
      this._uploadCoverPicModalEl.setAttribute('data-active', true);
      photoInputEl.setAttribute('data-img-set', true);
      return;
    }

    // preview img in imgel Directly (userProfileImg) without showing img in modal
    const photoEl = this._parentel.querySelector(
      `img[data-input-id="${photoInputEl.id}"]`
    );
    const formData = new FormData();
    formData.append('pic', file);

    setUploadImg(photoEl, file);
    patch('users/me', formData);
  }

  _previewUploadPhoto() {
    this._photoInputEls.forEach((photoInputEl) => {
      photoInputEl.addEventListener('change', this._uploadEvent.bind(this));
    });
  }

  add_handler_el() {
    // this._parentel.addEventListener('click', (e) => {
    //   const target = e.target;
    // });



    // show userProfileCoverPic img in setUserProfileCoverModal when user select upload set img in userProfileCover at page 
    // set userProfilePic directly in page
    this._previewUploadPhoto();


  }
}
