import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const submitBtn = document.querySelectorAll('.search-btn');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.style.display = 'none'; 
searchForm.addEventListener('submit', onSearchBtn); 
loadMoreBtn.addEventListener('click', onLoadMoreBtn); 

let pages = 1;

function onSearchBtn(event) {
    event.preventDefault(); 

    const name = searchInput.value.trim(); 
    pages = 1;
    gallery.innerHTML = ''; 
  
    if (name !== '') {
      pixabay(name); 
  
    } else {
      loadMoreBtn.style.display = 'none';
  
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  };


function onLoadMoreBtn() {

    const name = searchInput.value.trim();

    pages += 1; 
    pixabay(name, pages); 
  };

function onBtnLoadMore() {
    const name = refs.input.value.trim();
    pages += 1; 
    pixabay(name, pages); 
  }
  
  
async function pixabay(name, pages) {
    const API_URL = 'https://pixabay.com/api/';
  
    
    const options = {
      params: {
        key: '35900123-c9c0239e27eb1dd1d96f05647', 
        q: name,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: pages,
        per_page: 40,
      },
    };
  
    try {
         const response = await axios.get(API_URL, options);
  
         notiflixAlert(
        response.data.hits.length, 
        response.data.total 
      );

      if(response.data.total <=40) {
        loadMoreBtn.style.display = 'none';
      };
  
      createMarkup(response.data); 
    } catch (error) {
      console.log(error);
    }
  };

  const simpleLightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt', 
    captionDelay: 200, 
    preloading: true,
    disableScroll: true,
    alertError: true
  });

function createMarkup(hitsArray) {
    console.log(hitsArray)
    const markup = hitsArray.hits.map(({ comments, downloads, likes, views, tags, webformatURL, largeImageURL }) =>
          `<a class="photo-link" href="${largeImageURL}">
              <div class="photo-card">
              <div class="photo">
              <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
              </div>
                      <div class="info">
                          <p class="info-item">
                              <b>Likes</b>
                              ${likes}
                          </p>
                          <p class="info-item">
                              <b>Views</b>
                              ${views}
                          </p>
                          <p class="info-item">
                              <b>Comments</b>
                              ${comments}
                          </p>
                          <p class="info-item">
                              <b>Downloads</b>
                              ${downloads}
                          </p>
                      </div>
              </div>
          </a>`
      )
      .join(''); 
    gallery.insertAdjacentHTML('beforeend', markup); 
    simpleLightBox.refresh(); 

   
  };

  function notiflixAlert(length, totalHits) {
    if (length === 0) {
      loadMoreBtn.style.display = 'none';

      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
  
    if (pages === 1) {
      loadMoreBtn.style.display = 'block'; 
  
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  
    if (pages === 13) {
      loadMoreBtn.style.display = 'none';
       
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  };

  const btnUp = {
    el: document.querySelector('.btn-up'),
    show() {
      this.el.classList.remove('btn-up_hide');
    },
    hide() {
      this.el.classList.add('btn-up_hide');
    },
    addEventListener() {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        scrollY > 400 ? this.show() : this.hide();
      });

      
      document.querySelector('.btn-up').onclick = () => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  }
  
  btnUp.addEventListener();