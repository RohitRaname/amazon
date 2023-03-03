export default class SliderView {
  _parentel = document.querySelector('.slider');
  _slider_imgs = [...document.querySelectorAll('.slider-img')];
  _leftbtn = this._parentel.querySelector('button[data-btn="left"]');
  _rightbtn = this._parentel.querySelector('button[data-btn="right"]');

  constructor() {
    this.handle_slider();
  }

  _total_imgs = this._slider_imgs.length;
  _count = 1;

  slide() {
    const curindex = Number(this._parentel.dataset.curIndex);
    const nextindex = curindex + 1;
    if (nextindex > this._total_imgs) this._count = 0;

    const curimg = this._parentel.querySelector(
      `.slider-img[data-index="${curindex}"]`
    );
    const nextimg = this._parentel.querySelector(
      `.slider-img[data-index="${nextindex}"]`
    );

    curimg.dataset.active = false;
    nextimg.dataset.reset = true;
    nextimg.dataset.active = true;
  }

  click_on_slider_btns() {
    this._parentel.addEventListener('click', (e) => {
      const target = e.target;

      const btn = target.closest('button');
      if (!btn) return;

      const btn_direction = btn.dataset.btn;

      if (btn_direction === 'right') {
        this._count++;
      } else {
        this._count--;
      }

      if (this._count === this._total_imgs+1) this._count = 1;
      else if (this._count <= 0) this._count = this._total_imgs;

      this._parentel.dataset.index = this._count;

      this._slider_imgs.forEach(
        (mov, i) =>
          (mov.style.transform = `translateX(${(i + 1 - this._count) * 100}%)`)
      );
    });
  }

  //     slider() {

  //       if (this._count > this.this.__total_imgs) this._count = 1;

  //       this._sliderImgs.forEach((mov, i) => {
  //         mov.style.transform = `translateX(${(i + 1 - this._count) * 100}%)`;
  //       });
  //     }

  setInitialSlider() {
    this._slider_imgs.forEach((mov, i) => {
      mov.style.transform = `translateX(${i * 100}%)`;
    });
  }

  //   autoSlide() {
  //     this._parentel.querySelector(
  //         `.slider-img[data-index="1"]`
  //       ).dataset.initialSet=false;
  //     setInterval(() => {
  //       this._count = this._count + 1;
  //       this._parentel.dataset.curIndex=this._count;
  //       this.slide();
  //     }, 2000);
  //   }

  handle_slider() {
    this.setInitialSlider();
    this.click_on_slider_btns();
  }
}
