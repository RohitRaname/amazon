import { get } from '../../../../../Controller/api/api.js';
import ModalView from '../../../../Common/PositionComponent/ModalView.js';
import { RatingIconsHtml } from '../../../../Common/ratingIcons.js';

export default class ReviewPhotosGalleryModalView extends ModalView {
  _parentel = document.querySelector(
    '.modal[data-positionel-name="reviews-photo-gallery"]'
  );
  _gallery_containerel = this._parentel.querySelector(
    '.modal-gallery-container'
  );

  _previewReviewWindow = document.querySelector(
    '.modal-window[data-window="preview-review"]'
  );
  _storeReviewsWindow = document.querySelector(
    '.modal-window[data-window="store-reviews"]'
  );

  _lastReviewItemIndex;

  // variables change after every render ------
  _is_review_item_clicked;

  _cur_review_cur_imgel;
  _cur_review_all_preview_imgels;
  _total_img_reviews =
    this._storeReviewsWindow &&
    Number(this._storeReviewsWindow.getAttribute('data-total-docs'));

  _cur_review;
  _cur_review_index;
  _cur_review_img_index;
  _cur_review_total_img_count;
  _cur_review_all_imgs;

  // display or hide btns
  _set_btns_display_prop(type) {
    if (type === 'both') {
      this._photo_leftbtn.style.display = 'flex';
      this._photo_rightbtn.style.display = 'flex';
    }
    if (type === 'hide-both') {
      this._photo_leftbtn.style.display = 'none';
      this._photo_rightbtn.style.display = 'none';
    }
    if (type === 'left') {
      this._photo_leftbtn.style.display = 'flex';
      this._photo_rightbtn.style.display = 'none';
    }
    if (type === 'right') {
      this._photo_rightbtn.style.display = 'flex';
      this._photo_leftbtn.style.display = 'none';
    }
  }

  _show_btns() {
    // review index basic

    console.log(
      this._cur_review_index,
      this._cur_review_img_index,
      this._cur_review_total_img_count
    );
    if (this._is_review_item_clicked) {
      // img index basic
      if (
        this._cur_review_img_index === 0 &&
        this._cur_review_total_img_count > 1
      )
        this._set_btns_display_prop('right');
      else if (
        this._cur_review_img_index > 1 &&
        this._cur_review_img_index < this._cur_review_total_img_count - 1
      )
        this._set_btns_display_prop('both');
      else if (
        this._cur_review_img_index === this._cur_review_total_img_count - 1 &&
        this._cur_review_total_img_count > 1
      )
        this._set_btns_display_prop('left');
      else this._set_btns_display_prop('hide-both');

      return;
    }

    if (this._cur_review_index === 0) {
      // img index basic
      if (this._cur_review_img_index === 0)
        this._set_btns_display_prop('right');
      else if (
        this._cur_review_img_index > 0 &&
        this._cur_review_img_index < this._cur_review_total_img_count - 1
      )
        this._set_btns_display_prop('both');
      else if (this._cur_review_img_index === this._cur_review_total_img_count)
        this._set_btns_display_prop('left');
      else this._set_btns_display_prop('both');
    } else if (this._cur_review_index < this._total_img_reviews - 1) {
      this._set_btns_display_prop('both');
    } else if ((this._cur_review_index = this._total_img_reviews - 1)) {
      // img index basic
      if (
        this._cur_review_img_index === 0 &&
        this._cur_review_total_img_count > 1
      )
        this._set_btns_display_prop('right');
      else if (
        this._cur_review_img_index > 1 &&
        this._cur_review_img_index < this._cur_review_total_img_count - 1
      )
        this._set_btns_display_prop('both');
      else if (
        this._cur_review_img_index ===
        this._cur_review_total_img_count - 1
      )
        this._set_btns_display_prop('left');
      else this._set_btns_display_prop('hide-both');
    }
  }

  // review item markup (insert in store window)
  _generateMarkup(doc) {
    this._lastItemIndex = Number(this._lastItemIndex) + 1;
    this._storeReviewsWindow.setAttribute(
      'data-last-item-index',
      this._lastItemIndex
    );

    doc.author.name = this._stringifyText(doc.author.name);
    doc.author.country = this._stringifyText(doc.author.country);
    doc.content.title = this._stringifyText(doc.content.title);
    doc.content.text = this._stringifyText(doc.content.text);

    const reviewData = {
      _id: doc._id,
      parentVariantId: doc.ParentVariantId,
      author: doc.author,
      content: doc.content,
      ts: doc.ts,
    };

    return `<li 
        data-index="${this._lastItemIndex}" 
        data-positionel-btn="" 
        data-positionel-name="reviews-photo-gallery" 
        class="img-box-md"
        data-data=${JSON.stringify(reviewData)}>
        <img src="/img/reviews/${doc.content.photos[0]}" alt="">
      </li>`;
  }

  // load-reviews insert into store reviews
  async _loadReviews(limit) {
    let { page, lastItemIndex } = this._storeReviewsWindow.dataset;
    this._lastItemIndex = Number(lastItemIndex);
    page = Number(page) + 1;

    this._storeReviewsWindow.setAttribute('data-page', page);

    const res = await get(
      `${this._storeReviewsWindow.dataset.url}&page=${page}&${
        limit ? `limit=${limit}` : `defaultLimit=10&limit=none`
      }`
    );

    const modalList = this._storeReviewsWindow.querySelector(`.modal-list`);
    const html = res.data.docs.map((doc) => this._generateMarkup(doc)).join('');

    modalList.insertAdjacentHTML('beforeend', html);
  }

  // render review-preview
  render(datael, render_by_btn_click = false) {
    if (datael.dataset.window === 'store-reviews')
      return this._clickOnGridOptions(false, true);

    console.log('render', datael, render_by_btn_click);
    this._switchWindow('preview-review');

    this._lastReviewItemIndex = Number(
      this._storeReviewsWindows &&
        this._storeReviewsWindow.dataset.lastItemIndex
    );

    // click el => positionbtn-el(review-container-top-images) || review-item
    this._is_review_item_clicked = datael.closest('.review');
    this._total_img_reviews = this._is_review_item_clicked
      ? 1
      : Number(
          this._storeReviewsWindow &&
            this._storeReviewsWindow.getAttribute('data-total-docs')
        );

    this._parentel.querySelector('.modal-tab').style.display = this
      ._is_review_item_clicked
      ? 'none'
      : 'flex';

    this._cur_review = JSON.parse(datael.dataset.data);
    let { author, content, ts, count, rating } = this._cur_review;

    let { title, text, photos } = content;
    // if (
    //   this._storeReviewsWindow &&
    //   this._storeReviewsWindow.dataset.page !== '0'
    // ) {
      author.name = this._parseText(author.name);
      title = this._parseText(title);
      text = this._parseText(text);
      author.country = this._parseText(author.country);
    // }

    const html = `
    <div class="modal-gallery" data-index="${
      datael.dataset.index
    }"  data-total-imgs="${photos.length}">
        <!-- gallery main img -->
        <div class="modal-gallery-cur-photo-container" >
        <div class="modal-gallery-cur-photo-box">
        <img src="/img/reviews/${
          photos[0]
        }" class="modal-gallery-cur-photo" alt="${title}">

        <div class="modal-gallery-change-photo-btns">
            <button class="modal-gallery-change-photo-btn btn-icon" data-btn="left">
            <i class="fa fa-angle-left" aria-hidden="true"></i>
            </button>
            <button class="modal-gallery-change-photo-btn btn-icon" data-btn="right">
            <i class="fa fa-angle-right" aria-hidden="true"></i>
            </button>
        </div>
        </div>

        </div>

        <!-- gallery content => text | other related imgs -->
        <div class="modal-gallery-content">
        <!-- gallery details -->
        <div class="modal-gallery-text mg-b-sm-all mg-b-sm">
            <!-- review-author -->
            <div class="f-sm">
            <img src="/img/users/${author.pic || 'default.png'}" alt="${
      author.name
    }" class="img-avatar">
            <p class="pt-md">${author.name}</p>
            </div>

            <!-- stars and title -->
            <div>
            <div class="f-i product-rating-icons">
                ${RatingIconsHtml(Number(rating))}
            </div>

            <p class="s-7 s-d inline-span">${title}</p>
            </div>

            <!-- date -->
            <p class="t-sm">
            Reviewed in <span>${author.location}</span> on
            <span>${new Date(ts).toLocaleString()}</span>
            </p>

            <!-- review-text -->
            <p class="pt-md">
          ${text}
            </p>
        </div>

        <!-- gallery related imgs-->
        <div class="modal-gallery-all-photos grid-5 gap-lw">
        ${photos
          .map(
            (img) => `  
            <div class="box" data-outline data-scale-img data-active="false">
            <img src="/img/reviews/${img}" alt="" />
            </div>`
          )
          .join('')}
        </div>
        </div>
  </div>`;

    this._gallery_containerel.innerHTML = '';
    this._gallery_containerel.insertAdjacentHTML('afterbegin', html);

    // set render variables
    this._cur_review_cur_imgel = this._parentel.querySelector(
      '.modal-gallery-cur-photo'
    );
    this._cur_review_all_preview_imgels = [
      ...this._parentel
        .querySelector('.modal-gallery-all-photos')
        .querySelectorAll('.box'),
    ];
    this._photo_leftbtn = this._parentel.querySelector(
      '.modal-gallery-change-photo-btn[data-btn="left"]'
    );
    this._photo_rightbtn = this._parentel.querySelector(
      '.modal-gallery-change-photo-btn[data-btn="right"]'
    );

    const review_index = Number(datael.dataset.index);

    this._cur_review_all_preview_imgels[0].dataset.active = true;
    this._cur_review_index = review_index;

    this._cur_review_img_index =  0;
    this._cur_review_total_img_count = photos.length;
    this._cur_review_all_imgs = photos;
    this._show_btns();
  }

  // mark border around selected small preview img
  _active_cur_review_preview_img(preview_img_box) {
    this._activeel_in_arr(
      preview_img_box,
      this._parentel.querySelectorAll('.box')
    );
  }

  // right side small preview imgs
  _clickOnPreviewImgs(target) {
    const preview_img_box = target.closest('.box ');
    if (!preview_img_box) return;

    this._cur_review_all_preview_imgels.forEach((el, i) => {
      if (el === preview_img_box) this._cur_review_img_index = i;
    });

    this._activeel_in_arr(
      preview_img_box,
      this._parentel.querySelectorAll('.box')
    );

    this._show_btns();
    this._cur_review_cur_imgel.src = preview_img_box.querySelector('img').src;
  }

  // change cur-img to next preview img on btn click
  async _clickOnChangephotoBtn(target, handle) {
    const btn = target.closest('.modal-gallery-change-photo-btn');
    if (!btn) return;

    if (btn.dataset.btn === 'right') {
      // when review written img not clicked
      // next img of cur review
      if (this._cur_review_img_index < this._cur_review_total_img_count - 1) {
        this._cur_review_img_index = this._cur_review_img_index + 1;
        this._cur_review_cur_imgel.src =
          '/img/reviews/' +
          this._cur_review_all_imgs[this._cur_review_img_index];
      } else {
        // next img of next review
        this._cur_review_index = this._cur_review_index + 1;
        const next_review_exist_in_dom =
          this._cur_review_index < this._lastReviewItemIndex;

        if (next_review_exist_in_dom) {
          const modal_item = this._storeReviewsWindow.querySelector(
            `li[data-index="${this._cur_review_index}"]`
          );

          this.render(modal_item);
        } else if (this._cur_review_index < this._total_img_reviews - 1) {
          await this._loadReviews(10);
          const modal_item = this._storeReviewsWindow.querySelector(
            `li[data-index="${this._cur_review_index}"]`
          );
          this.render(modal_item);
        }
      }
    }
    if (btn.dataset.btn === 'left') {
      // when review written img not clicked
      //  img of cur review
      if (this._cur_review_img_index > 0) {
        this._cur_review_img_index = this._cur_review_img_index - 1;
        this._cur_review_cur_imgel.src =
          '/img/reviews/' +
          this._cur_review_all_imgs[this._cur_review_img_index];
      } else {
        // next img of next review
        this._cur_review_index = this._cur_review_index - 1;

        if (this._cur_review_index >= 0) {
          const modal_item = this._storeReviewsWindow.querySelector(
            `li[data-index="${this._cur_review_index}"]`
          );

          if (modal_item) this.render(modal_item, false);
          else await this._loadReviews(10);
        }
      }
    }

    // console.log(this._cur_review_index, this._cur_review_img_index);

    this._show_btns();
    this._active_cur_review_preview_img(
      this._cur_review_all_preview_imgels[this._cur_review_img_index]
    );
  }

  // show all review images
  async _clickOnGridOptions(target, optionalTarget) {
    const review_grid_photo =
      optionalTarget || target.closest('[data-action="show-all-photos"]');
    if (!review_grid_photo) return;

    if (this._storeReviewsWindow.dataset.allDocsSet === 'false') {
      this._showSpinner(this._parentel);
      await this._loadReviews();
      this._hideSpinner(this._parentel);
      this._storeReviewsWindow.dataset.lastItemIndex =
        Number(this._storeReviewsWindow.dataset.totalDocs) - 1;
      this._storeReviewsWindow.dataset.allDocsSet = true;
    }

    this._switchWindow(this._storeReviewsWindow.dataset.window);
  }

  click_on_content(target, handle) {
    this._clickOnPreviewImgs(target);
    this._clickOnChangephotoBtn(target, handle);
    this._clickOnGridOptions(target);
  }
}
