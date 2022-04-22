import View from './View.js';
import icons from 'url:../../img/icons.svg';

class HomeView extends View {
  _parentElement = document.querySelector('.main');

  _generateMarkup() {
    const markup = `
        <div class="tag">
          <a href="#" class="tag__item">All</a>
          <a href="#" class="tag__item">Recommended</a>
        </div>
          <div class="product-box">
            ${this._data.map(el => this._generateProductMarkup(el)).join('')}
          </div>
        `;

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

export default new HomeView();
