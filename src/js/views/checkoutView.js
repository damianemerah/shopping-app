import View from './View.js';
// import icon

export class CheckoutView extends View {
  _parentElement = document.querySelector('.main-content');

  addHandlerProduct(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerSize(handler) {
    this._parentElement.addEventListener('click', e => {
      const sizes = document.querySelectorAll('.product-view__size');
      const sizeEl = e.target.closest('.product-view__size');
      const size = document.querySelector('.product-view__desc');

      if (!sizeEl) return;
      size.textContent = sizeEl.textContent;
      sizes.forEach(el => {
        el.classList.remove('active');
      });
      e.target.classList.add('active');

      handler(sizeEl.textContent);
    });
  }

  addHandlerColor(handler) {
    this._parentElement.addEventListener('click', e => {
      const colors = document.querySelectorAll('.product-view__thumbnail');
      const color = e.target.closest('.product-view__thumbnail');
      if (!color) return;
      colors.forEach(el => {
        el.classList.remove('active');
      });
      color.classList.add('active');

      const bigImg = document
        .querySelector('.product-view__img--big')
        .querySelector('img');

      if (e.target.closest('.product-view__thumbnail-img')) {
        const clickedImg = color.querySelector('img');
        bigImg.src = clickedImg.src;
      }

      if (e.target.closest('.product-view__thumbnail-color')) {
        const productColor = color.querySelector('img');
        handler(productColor);
      }
    });
  }

  addHandlerQuantity(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.product-view__quantity-btn');

      if (!btn) return;
      const quant = e.target.dataset.btn;
      handler(quant);
    });
  }

  addHandlerCheckout(handler) {
    this._parentElement.addEventListener('click', e => {
      const buyBtn = e.target.closest('.product-view__checkout-btn');
      if (!buyBtn) return;
      e.preventDefault();
      handler();
    });
  }

  addHandlerCart(handler) {
    this._parentElement.addEventListener('click', e => {
      const cartBtn = e.target.closest('.product-view__cart-btn');
      if (!cartBtn) return;

      e.preventDefault();
      handler();
    });
  }

  _generateMarkup() {
    const markup = `<div class="product-view">
    <div class="product-view__content container">
      <div class="product-view__img-box">
        <div class="product-view__img--big">
          <img
            src='${this._data.image}'
            id="${this._data.permalink}"
            alt="Product image"
          />
        </div>
        <div class="product-view-list">
          <ul class="product-view__thumbnail-img">
            ${this._data.assets.map(this._generateMarkupThumnail).join('')}
          </ul>
        </div>
      </div>

      <div class="product-view__details">
        <h1 class="product-view__title">
        ${this._data.name}
        </h1>

        <p>
        <span class="product-view__term">Color:</span
        >

        </p>
        
        ${this._data.variantGroups
          .filter(cur => cur.name.toLowerCase() === 'color')
          .map(
            cur =>
              `<ul class="product-view__thumbnail-color" data-variantID="${cur.id}">`
          )}

            ${this._data.assets.map(this._generateMarkupThumnail).join('')}
        </ul>
        <p>
          <span class="product-view__term mg-sm">Size:</span
          ><span class="product-view__desc text-up">XL</span>
        </p>
        
        ${this._data.variantGroups
          .filter(cur => cur.name.toLowerCase() === 'size')
          .map(
            cur =>
              `<div class="product-view__size-box" data-variantID="${cur.id}">`
          )}
          
          ${this._data.variantGroups
            .filter(cur => cur.name.toLowerCase() === 'size')
            .flatMap(cur => cur.options)
            .map(
              cur =>
                `<p class="product-view__size text-up" data-size="${cur.id}">${cur.name}</p>`
            )
            .join('')}
        </div>

        <p class="product-view__term">Quantity:</p>
        <div class="product-view__quantity-input">
          <button
            class="product-view__quantity-btn product-view__quantity-btn--minus"
            data-btn="minus"
          >
            -
          </button>
          <p class="product-view-quantity" data-quantity="1">1</p>
          <button
            class="product-view__quantity-btn product-view__quantity-btn--plus"
            data-btn="plus"
          >
            +
          </button>
        </div>
        <div class="product-view__btn-box">
          <a href="#" class="product-view__btn product-view__checkout-btn big-btn">Buy now</a
          ><a href="#" class="product-view__btn product-view__cart-btn big-btn">Add to cart</a>
          <a
            href="#"
            class="active product-view__btn big-btn product-view__btn--cart"
            ><svg class="icon">
              <use href="./src/img/icons.svg#heart-solid"></use></svg
          ></a>
        </div>
      </div>
    </div>
  </div>`;

    return markup;
  }

  _generateMarkupThumnail(cur) {
    const markup = `<li class="product-view__img product-view__thumbnail" data-asset="${cur.id}">
                    <img
                        src="${cur.image}"
                        alt="Product image"
                    /> 
                </li>`;

    return markup;
  }
}

export default new CheckoutView();
