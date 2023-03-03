import { get } from '../../../../../Controller/api/api.js';
import ModalView from '../../../../Common/PositionComponent/ModalView.js';

export default class ReviewPhotosModalView extends ModalView {
  _parentel = document.querySelector('.product-reviews-container');

  // attribute updated when new docs are being loadded
  _lastItemIndex;
  _page;
}
