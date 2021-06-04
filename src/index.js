import { notice } from '@pnotify/core';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import './sass/main.scss';
import ApiService from './js/apiService';
import card from './partials/card.hbs';



const refs = {
  listEl: document.querySelector('.gallery'),
  inputEl: document.querySelector('input'),
  searchBtn: document.querySelector('.search-btn'),
  loadMoreBtn: document.querySelector('.btn'),
}

refs.searchBtn.addEventListener('click', onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

const apiService = new ApiService();

async function onSearchBtnClick(e) {
  e.preventDefault();

  const inputValue = refs.inputEl.value

  clearImgList();

  if (inputValue === '') {
    notice({
      text: 'Please type search query',
      type: 'notice',
      sticker: false,
      maxTextHeight: null,
      delay: 3000,
    })
    return;
  }

  apiService.query = inputValue;
  apiService.resetPage();
  const response = await apiService.fetchImg();

  if (response.hits.length !==0) {
    renderImgList(response);
    refs.loadMoreBtn.classList.remove('is-hiden');
  } else {
    notice({
      text: 'Nothing found',
      type: 'notice',
      sticker: false,
      maxTextHeight: null,
      delay: 3000,
    });
    refs.loadMoreBtn.classList.add('is-hiden');
  }

}

async function onLoadMoreBtnClick(e) {
  e.preventDefault();

  apiService.incrementPage();

  const response = await apiService.fetchImg();
  renderImgList(response);

  refs.loadMoreBtn.scrollIntoView({
  behavior: 'smooth',
  block: 'end',
});
}

function renderImgList(imgArr) {
  const fetchList = imgArr.hits.map(card).join('');
  refs.listEl.insertAdjacentHTML('beforeend', fetchList);
}

function clearImgList() {
  refs.listEl.innerHTML = '';
}
