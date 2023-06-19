
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import {getRequest} from './js/api';
import { makeMarkup } from './js/gallery';
const galleryWrapper=document.querySelector('.gallery');
const formEl = document.querySelector('form');
const inputEl =document.querySelector('input');
let totalValues;
let inputValue='';
let page; 
let searchQuery = '';

 async function onFormSubmit(evt) {
  evt.preventDefault();
  inputValue = inputEl.value;
 searchQuery=inputValue;

  let responseData;
  if(inputValue===''){
    Notiflix.Report.warning("Please, enter your request!")
  }else{
      try {
          responseData = await getRequest(inputValue, page);
          if (responseData.data.total === 0) {
              throw new Error('Sorry, there are no images matching your search query. Please try again.');
          } else {
           galleryWrapper.innerHTML = '';
            makeMarkup(responseData);
            inputEl.value = '';
            Notiflix.Report.success(`Hooray! We found ${responseData.data.totalHits} images.`)
          }
      } catch (error) {inputEl.value = '';
        Notiflix.Report.failure(error.message,"ERROR request!Please,try again!");
        
  }}
};

formEl.addEventListener('submit', onFormSubmit);

let isLoading = false;
let throttleTimeout;
let currentScrollTop = 0;
let previousScrollTop = 0;

async function loadMoreImages() {
  if (isLoading || page * perPage >= totalValues) {
    return;
  }
  isLoading = true;
  page++;
  previousScrollTop = window.pageYOffset;
  try {
    let responseData = await getRequest(searchQuery, page);
    makeMarkup(responseData);
    totalValues = responseData.data.totalHits;
  } catch (error) {
    Notiflix.Report.failure(error.message,"ERROR!");
  } finally {
    isLoading = false;
    window.scrollTo(0, previousScrollTop);
  }
}

function onWindowScroll() {
  clearTimeout(throttleTimeout);
  throttleTimeout = setTimeout(function () {
    const documentRect = document.documentElement.getBoundingClientRect();
    if (documentRect.bottom < document.documentElement.clientHeight + 150 && window.pageYOffset > currentScrollTop) {
      loadMoreImages();
    }
    currentScrollTop = window.pageYOffset;
  }, 200);
}

window.addEventListener('scroll', onWindowScroll);



