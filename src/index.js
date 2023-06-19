
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const galleryWrapper=document.querySelector('.gallery');
const formEl = document.querySelector('form');
const inputEl =document.querySelector('input');
let totalValues;
let inputValue='';
let page; 
let searchQuery = '';
let perPage;
let lightbox;
function getApi(inputValue, page) {
  let  perPage = 40;
  const urlAPI = 'https://pixabay.com/api/?';
  const searchParams = new URLSearchParams({
      key: '37210497-313bcce70e0ab9e64eed10137',
      q: inputValue,
      image_type: 'photo',
      orientation: 'horizontal',
      maxHeight: 300,
      safesearch: true,
      per_page: perPage,
      page: page,
  });
return urlAPI + searchParams.toString();
}
 export async function getRequest(inputValue, page) {
  const url = getApi(inputValue, page);
 
  return axios.get(url).then(response => response).catch(error => Notiflix.Notify.warning(error))
}

export function makeMarkup(responseData) {
    let gallery = responseData.data.hits.map(item => {
      let galleryItem = document.createElement('div');
      galleryItem.className = 'photo-card';
      galleryItem.innerHTML = `
        <a class="gallery_link" href="${item.largeImageURL}">
          <img class="image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
        </a>
        <div class="info">
          <p class="info-item">
            ${item.likes}<br>
            <b class="info-item-name">Likes</b>
          </p>
          <p class="info-item">
            ${item.views}<br>
            <b class="info-item-name">Views</b>
          </p>
          <p class="info-item">
            ${item.comments}<br>
            <b class="info-item-name">Comments</b>
          </p>
          <p class="info-item">
            ${item.downloads}<br>
            <b class="info-item-name">Downloads</b>
          </p>
        </div>
      `;
      return galleryItem;
    });
    
  gallery.forEach(item=>{
    galleryWrapper.appendChild(item)
  });
   lightbox.refresh();
  
   const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
  window.scrollTo(0, 0)
   }
   document.addEventListener('DOMContentLoaded', function() {
    lightbox = new SimpleLightbox('.photo-card a');
  });
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



