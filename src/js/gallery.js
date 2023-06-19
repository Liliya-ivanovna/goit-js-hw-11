import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
let lightbox;
const galleryWrapper=document.querySelector('.gallery');
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