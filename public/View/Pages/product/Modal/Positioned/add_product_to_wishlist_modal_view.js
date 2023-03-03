import PositionElView from '../../../../Common/PositionComponent/base.js';
import ModalView from '../../../../Common/PositionComponent/ModalView.js';
import {post} from "../../../../../Controller/api/api.js"

export default class AddProductToWishlistModalView extends PositionElView{
  _parentel = document.querySelector(
    '.modal[data-positionel-name="add-product-to-wishlist-modal"]'
  );
  _positionbtn_el = document.querySelector(
    `[data-positionel-btn][data-positionel-name="add-product-to-wishlist-modal"]`
  );

  _parent_containerel = this._parentel.querySelector('.modal-container');

  _product_already_added_msg = this._parentel.querySelector(
    'modal-item-duplicate'
  );

  _newItemAddText=this._parentel.querySelector('.modal-item-add')

  _duplicateItemAddhtml(wishlist) {
    return `
    <div class="modal-item-duplicate"><h6 class="h-6 h-m">This item was already in<a class="btn-inline-u modal-wishlist-name letter-s" href="/wishlist/${wishlist._id}">${wishlist.name}</a></h6><p class="t-sm">We moved it to the top of list.</p></div>`;
  }

  _newItemAddhtml(wishlist) {
    return `
    <div class="modal-item-new-add-box"><h class="h-m h-6">One item added to<a class="btn-inline-u letter-s" href="/wishlist/${wishlist._id}">${wishlist.name}</a></h></div>

      
`;
  }

  render(data) {


    const {wishlist, type } = data;
    this._newItemAddText.innerHTML=""
    
    const html= type==="item-exist"?this._duplicateItemAddhtml(wishlist):this._newItemAddhtml(wishlist)

    this._newItemAddText.innerHTML= html;
  }


  async _loadQueryDataAndRender(positionbtnelData){
    const data=positionbtnelData;

    // adding item to wishlist
    const resData = await post(
      `users/me/wishlists/${data.wishlist._id}/add-product`,
      data,
      false,
      true
    );




    if (resData.message === 'item-exist') data.type = 'item-exist';

    this.render(data)


  }

  // additional_funcs() {
  //   this.hover_on_positionbtnel();
  // }
}
