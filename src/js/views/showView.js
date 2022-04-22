import View from './View.js';

class ShowView extends View {
  _parentElement = document.querySelector('.main-content');

  addHandlerCategory(handler) {
    const category = document.querySelector('.header__nav');
    const CatArray = [...category.querySelectorAll('.header__link')];

    category.addEventListener('click', e => {
      this._parentElement = document.querySelector('.main-content');
      this._generateMarkup = this._generateMarkupCategory;

      const link = e.target.closest('.header__link');
      if (!link) return;

      CatArray.forEach(el => {
        el.classList.remove('header__link--active');
        e.target.classList.add('header__link--active');
      });
      const { id } = link.dataset;
      handler(id);
    });
  }

  addHandlerFilter(handler) {
    this._parentElement.addEventListener('click', e => {
      this._parentElement = document.querySelector('.sub-category');
      this._generateMarkup = this._generateMarkupFilter;

      const btn = e.target.closest('.category__filter-btn');

      if (!btn) return;
      const min = document.querySelector('#min');
      const max = document.querySelector('#max');
      const range = {
        min: +min.value,
        max: +max.value,
      };
      if (!btn) return;
      handler(range);
    });
  }

  addHandlerSubCategory(handler) {
    this._parentElement.addEventListener('click', e => {
      const slugs = document.querySelectorAll('.slug');
      this._parentElement = document.querySelector('.sub-category');
      this._generateMarkup = this._generateMarkupSubCategory;

      const target = e.target.closest('.slug');
      if (!target) return;
      handler(target.textContent);
      slugs.forEach(el => {
        el.classList.remove('slug--active');
      });
      e.target.classList.add('slug--active');
    });
  }

  addHandlerSort(handler) {
    this._parentElement.addEventListener('click', e => {
      const sortUp = e.target.closest('#up');
      const sortDown = e.target.closest('#down');
      const sortIcons = document.querySelectorAll('i[data-sort]');
      this._generateMarkup = this._generateMarkupSorted;

      if (e.target === sortUp || e.target === sortDown) {
        const sort = e.target.id;
        sortIcons.forEach(icon => {
          icon.classList.remove('active');
        });
        e.target.classList.add('active');

        handler(sort);
      }
    });
  }

  _generateMarkupSubCategory() {
    return `${this._data.slugProducts
      .map(el => this._generateProductMarkup(el))
      .join('')}`;
  }

  _generateMarkupSorted() {
    return `${this._data.sortedProducts
      .map(el => this._generateProductMarkup(el))
      .join('')}`;
  }

  _generateMarkupFilter() {
    return `${this._data.subProducts
      .map(el => this._generateProductMarkup(el))
      .join('')}`;
  }

  _generateMarkupCategory() {
    const markup = `<div class="category">
        <div class="category__filters container">
            <div class="category__sort category__sort-price">
            <span>Price</span>
            <input
                type="number"
                name="min"
                id="min"
                placeholder="min"
                data-min="min"
            /><span>-</span><input
                type="number"
                name="max"
                id="max"
                placeholder="max"
                data-max="max"
            />
            <button class="category__filter-btn">OK</button>
            </div>
            <div class="category__sort">
                <span>Sort By:</span>
                <div class="category__sort-price">
                <p>Price</p>
                <div class="category__sort-price-icons">
                    <i id="up" class="las la-sort-up" data-sort="up"></i>
                    <i id="down" class="las la-sort-down" data-sort="down"></i>
                </div>
                </div>
            </div>
            
        </div>
        <div class="slug-box">
            <div class="slug__list container">
            ${this._data.slug
              .map(el => `<a href="#" class="slug text-cap">${el}</a>`)
              .join('')}
            </div>
        </div>
        <div class="product-box container sub-category">
        ${this._data.allProducts
          .map(el => this._generateProductMarkup(el))
          .join('')}
        </div>
        </div>`;

    return markup;
  }

  _generateProductMarkup(cur) {
    return `
        <a href="/#${cur.id}" class="product">
            <div class="product__img-box">
            <img
                src='${cur.image}'
                alt="Product Image"
                class="product__img"
            />
            </div>
            <div class="product__desc">
            <span href="#" class="product__detail">
                ${cur.name}</span
            >
            <p class="Product__price-box">
                 <span class="product__price">NGN ${cur.price}</span>
            </p>
            </div>
        </a>`;
  }
}

export default new ShowView();
