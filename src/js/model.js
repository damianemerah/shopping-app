'use strict';
import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { AJAX } from './helpers';

export const state = {
  products: [],
  product: {},
  campaign: {},
  category: {},
  cart: [],
};

export const createProducts = function (data) {
  const product = data.map(item => {
    return {
      id: item.id,
      description: item.description,
      assets: item?.assets.map(cur => {
        return {
          id: cur.id,
          image: cur.url,
        };
      }),
      name: item.name,
      price: +item.price.raw,

      image: item.image.url,
      categories: item.categories
        .map(el => el.slug)
        .map(el => {
          if (el.toLowerCase() === 'women' || el.toLowerCase() === 'men') {
            return { main: el };
          }
          return { sub: el };
        }),
      permalink: item.permalink,

      variantGroups: item?.variant_groups.map(cur => {
        return {
          id: cur.id,
          name: cur.name,
          options: cur.options.map(opt => {
            return { id: opt.id, name: opt.name };
          }),
        };
      }),
    };
  });

  return product;
};

export const uploadData = function (obj) {
  const data = {
    line_items: {
      [obj.productID]: {
        [obj.variant.variantID]: obj.variant.option,
      },
      quantity: obj.quantity,
    },

    customer: {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8901',
    },
    shipping: {
      name: 'John Doe',
      street: '123 Fake St',
      town_city: 'San Francisco',
      county_state: 'California',
      postal_zip_code: '94103',
      country: 'US',
    },

    payment: {
      gateway: 'stripe',
      card: {
        number: '4242 4242 4242 4242',
        token: 'tok_1IJ5Nn2eZvKYlo2CqceJkfue',
        nonce: 293074902374234,
      },

      stripe: {
        payment_method_id: 'pm_1IJ5aB2eZvKYlo2CdmTQz0av',
        payment_intent_id: 'pi_1DlITH2eZvKYlo2CuM28qGnc',
        customer_id: 'cus_4QEipX9Dj5Om1P',
        setup_future_usage: 'on_session',
      },
    },
  };
  console.log('data', data);
  return data;
};

export const loadProducts = async function () {
  //load products
  try {
    //load all products
    const data = await AJAX(`${API_URL}products`);
    const newData = data.data;
    state.products = createProducts(newData);
    //load campaign banners
    const dataCampaign = await AJAX(`${API_URL}categories/cat_Kvg9l6Zbbl1bB7`);

    state.campaign.description = dataCampaign.description;
    state.campaign.images = dataCampaign.assets.map(cur => cur.url);
    const firstClone = state.campaign.images[0];
    state.campaign.images.push(firstClone);
  } catch (err) {
    console.log(err.message);
  }
};

export const loadProduct = async function (id) {
  try {
    const data = await AJAX(`${API_URL}products/${id}`);
    const product = createProducts([data]);
    state.product = product[0];
  } catch (err) {
    console.log(error);
  }
};

export const loadCategory = function (id) {
  if (state.products.length <= 0) return;

  if (id === 'all') {
    state.category.allProducts = state.products;
    state.category.slugProducts = state.products;

    const slug = state.products
      .map(el => el.categories)
      .flatMap(item => item)
      .filter(el => el.sub && el.sub)
      .map(el => el.sub);

    state.category.slug = [...new Set(slug)];
  } else {
    const category = state.products.filter(item =>
      item.categories.some(el => el.main === id)
    );

    state.category.allProducts = category;
    state.category.slugProducts = category;

    const slug = category
      .map(el => el.categories)
      .flatMap(item => item)
      .filter(el => el.sub && el.sub)
      .map(el => el.sub);

    state.category.slug = [...new Set(slug)];
  }

  return state.category;
};

export const loadSubCategory = function (sub) {
  const products = state.category.allProducts.filter(item =>
    item.categories.some(el => el.sub === sub)
  );

  state.category.slugProducts = products;
};

export const loadFilter = function (obj) {
  if (obj.min > obj.max) {
    const products = state.category.slugProducts.filter(
      item => item.price >= obj.min
    );
    state.category.subProducts = products;
  }

  if (obj.min <= 0 && obj.max <= 0) return;

  if (obj.min >= 0 && (obj.min <= obj.max || obj.max > obj.min)) {
    const products = state.category.slugProducts.filter(
      item => item.price >= obj.min && item.price <= obj.max
    );
    state.category.subProducts = products;
  }
};

export const loadSorted = function (sort) {
  if (sort === 'down') {
    const sorted = state.category.slugProducts.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    );
    state.category.sortedProducts = sorted;
  }

  if (sort === 'up') {
    const sorted = state.category.slugProducts.sort(
      (a, b) => parseFloat(b.price) - parseFloat(a.price)
    );
    state.category.sortedProducts = sorted;
  }
};

export const changeQuantity = function (amt) {
  const element = document.querySelector('.product-view-quantity');
  let quantity = +element.dataset.quantity;
  if (quantity <= 1 && amt === 'minus') return;
  if (quantity > 1 && amt === 'minus') {
    quantity--;
    element.dataset.quantity = quantity;
    element.textContent = element.dataset.quantity;
  }
  if (amt === 'plus') {
    quantity++;
    element.dataset.quantity = quantity;
    element.textContent = element.dataset.quantity;
  }
  console.log('quantity', quantity);
};

export const createCheckout = function (cart = true) {
  const order = {};

  //get selected image id
  const colorArr = [
    ...document.querySelectorAll('.product-view__thumbnail'),
  ].filter(el => el.closest('.product-view__thumbnail-color'));

  order.permalink = state.product.permalink;

  const selectedImg = colorArr.find(img => img.classList.contains('active'));

  //get product id

  if (!selectedImg) throw new Error('Select a desired color');
  order.productID = selectedImg.dataset.asset;
  console.log(order.productID);

  const sizeArr = [...document.querySelectorAll('.product-view__size')];

  const selectedSize = sizeArr.find(el => el.classList.contains('active'));

  if (!selectedSize) throw new Error('Select a desired size');

  order.variant = {
    variantID: document.querySelector('.product-view__size-box').dataset
      .variantid,
    option: selectedSize.dataset.size,
  };

  const { quantity } = document.querySelector('.product-view-quantity').dataset;

  order.quantity = quantity;

  if (cart) {
    state.cart.push(order);
    const cartCount = document.querySelector('.header__cart-count');
    cartCount.textContent = state.cart.length;
    state.isCart = true;
    // console.log('cart', state.cart);
    // console.log('cart', state.isCart);
    //api cart
  } else {
    state.order = { ...order };
    console.log('order', state.order);
    //api checkout
  }
};

export const createCart = async function () {
  try {
    const data = await AJAX(`${API_URL}carts`);
  } catch (error) {}
};

export const newCheckout = async function (id) {
  try {
    const data = await AJAX(`${API_URL}checkouts/${id}`);
    state.order.checkOutID = data.id;
    console.log(state.order);
  } catch (err) {
    console.log(err);
  }
};

export const uploadOrder = async function () {
  try {
    const data = await AJAX(
      `${API_URL}checkouts/${state.order.checkOutID}`,
      uploadData(state.order)
    );
  } catch (error) {
    console.log(error);
  }
};
