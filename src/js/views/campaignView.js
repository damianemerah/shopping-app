import View from './View.js';
import icons from 'url:../../img/icons.svg';

class CampaignView extends View {
  _parentElement = document.querySelector('.top-view');
  _campaignImages = document.querySelectorAll('.campaign');
  _curSlide = 0;

  constructor() {
    super();
  }

  _generateMarkup() {
    const markup = `
    
    <div class="hero">
      <div class="hero__campaign">

        <div class="dots">
        ${
          this._data.images.length > 1
            ? this._data.images
                .map(
                  (_, index) =>
                    `<button class="dots__dot" data-slide="${index}"></button>`
                )
                .slice(0, this._data.images.length - 1)
                .join()
            : ''
        }

        
        </div>
        <div class="hero__img-box--big">
        ${this._data.images.map(this._generateCampaignMarkup).join('')}    
        </div>
      </div>
      
      <div class="hero__img-box--small-1">
        <img
          src="./src/img/freestocks-_3Q3tsJ01nc-unsplash.jpg"
          alt="Hero image"
          class="hero__img"
        />
      </div>
      <div class="hero__img-box--small-2">
        <img
          src="./src/img/freestocks-_3Q3tsJ01nc-unsplash.jpg"
          alt="Hero image"
          class="hero__img"
        />
      </div>
    </div>
 
  `;
    return markup;
  }

  _generateCampaignMarkup(el) {
    return `<img
                src="${el}"
                alt="Desc"
                class="hero__img campaign"
            />`;
  }

  handlerDots() {
    const dotContainer = document.querySelector('.dots');

    dotContainer.addEventListener('click', e => {
      const btn = e.target.closest('.dots__dot');

      if (!btn) return;
      const slide = +btn.dataset.slide;

      this._curSlide = slide;

      this._slides.style.transform = `translateX(-${this._curSlide * 100}%)`;
      this.activateDot(this._curSlide);
    });
  }

  handleSlider() {
    this._slides.addEventListener('transitionend', () => {
      if (this._curSlide === this._slideArray.length) {
        this._slides.style.transition = 'none';
        this._curSlide = 0;
        this._slides.style.transform = `translateX(-${this._curSlide * 100}%)`;
      }
    });
  }

  gotoSlide(slide) {
    this._slides = document.querySelector('.hero__img-box--big');
    this._slideArray = [...this._slides.querySelectorAll('.campaign')];
    if (this._curSlide >= this._slideArray - 1) return;

    this._slides.style.transition = `0.7s linear`;
    this._slides.style.transform = `translateX(-${slide * 100}%)`;

    //hiding last clone btn

    if (this._curSlide === this._slideArray.length - 1) {
      this.activateDot(0);
    } else {
      this.activateDot(this._curSlide);
    }

    this._curSlide++;
  }

  activateDot(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }
}

export default new CampaignView();
