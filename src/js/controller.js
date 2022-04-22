'use strict';
import * as model from './model.js';
import homeView from './views/homeView.js';
import campaignView from './views/campaignView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import showView from './views/showView.js';
import checkoutView from './views/checkoutView.js';
import { async } from 'regenerator-runtime/runtime';
if (module.hot) {
  module.hot.accept();
}

////////////////////////////

const interval = 5000;
let timeFunc;
// let curSlide = campaignView._curSlide
const renderHomePage = async function () {
  try {
    await model.loadProducts();
    //render products & campaign banner
    model.state.campaign.images &&
      model.state.campaign.images.length > 0 &&
      campaignView.render(model.state.campaign);

    homeView.render(model.state.products);
    campaignView.gotoSlide(0);

    campaignView.handleSlider();
    campaignView.handlerDots();
    timeFunc = setInterval(() => {
      campaignView.gotoSlide(campaignView._curSlide);
    }, interval);
  } catch (err) {
    console.log(err);
  }
};

const renderCategory = function (id) {
  clearInterval(timeFunc);
  // window.history.pushState(null, '', `#${id}`);
  model.loadCategory(id);
  showView.render(model.state.category);

  // showView.addHandlerSubCategory();
};

const renderSubCategory = function (sub) {
  model.loadSubCategory(sub);
  showView.render(model.state.category);
};

const renderFilter = function (obj) {
  model.loadFilter(obj);
  showView.render(model.state.category);
};

const renderPriceSort = function (sort) {
  model.loadSorted(sort);
  showView.render(model.state.category);
};

const renderProduct = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    checkoutView.renderSpinner();
    clearInterval(timeFunc);
    await model.loadProduct(id);
    checkoutView.render(model.state.product);
  } catch (err) {
    console.error(err);
  }
};

const controlOrderSize = function (handler) {
  console.log(handler);
};

const controlOrderQuant = function (handler) {
  model.changeQuantity(handler);
};

const controlOrderColor = function (handler) {
  console.log(handler);
};

const controlCheckout = async function () {
  try {
    model.createCheckout(false);
    console.log(model.state.product);

    // window.history.pushState(null, '', `checkout`);
    await model.newCheckout(model.state.order.permalink);
    await model.uploadOrder();
  } catch (error) {
    alert(error.message);
  }
};

const controlCart = async function () {
  try {
    model.createCheckout(true);
    await model.createCart();
    console.log(model.state);
  } catch (error) {
    alert(error.message);
  }
};

const init = function () {
  renderHomePage();
  showView.addHandlerCategory(renderCategory);
  showView.addHandlerSubCategory(renderSubCategory);
  showView.addHandlerFilter(renderFilter);
  showView.addHandlerSort(renderPriceSort);
  checkoutView.addHandlerProduct(renderProduct);
  checkoutView.addHandlerColor(controlOrderColor);
  checkoutView.addHandlerSize(controlOrderSize);
  checkoutView.addHandlerQuantity(controlOrderQuant);
  checkoutView.addHandlerCheckout(controlCheckout);
  checkoutView.addHandlerCart(controlCart);

  console.log('starting...1284');
};
init();

//TOdo
// if campaign && camp > 1 --render campaign and button
