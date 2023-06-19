import axios from 'axios';
import Notiflix from 'notiflix';
let perPage;
function getApi(inputValue, page) {
    perPage = 40;
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
    
export  async function getRequest(inputValue, page) {
      const url = getApi(inputValue, page);
     return axios.get(url).then(response => response).catch(error => Notiflix.Notify.warning(error))
    }
    
