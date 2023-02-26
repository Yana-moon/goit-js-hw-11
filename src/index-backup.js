import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const userId = '33912044-22b2651672bec86fc9e274e80';
const requestUrl = 'https://pixabay.com/api';

const emptyRequest =
  'Sorry, there are no images matching your search query. Please try again.';
const endOfRequest =
  "We're sorry, but you've reached the end of search results.";

const formRequest = document.querySelector('#search-form');
const galleryDesk = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

let numPage = 1;
const per_page = 40;


formRequest.addEventListener('submit', e => {
  e.preventDefault();
  numPage = 1;
  const findText = formRequest.elements.searchQuery.value.trim();
  console.log(findText);

  async function getImage() {
    const request = await axios({
      url: `${requestUrl}`,
      params: {
        key: userId,
        q: findText,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: per_page,
        page: numPage,
      },
    });
    const totalHits = request.data.totalHits;
    const pageGroup = totalHits / per_page;
    console.log(pageGroup);
    const responseArray = [];
    for (const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } of request.data.hits) {
      responseArray.push({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      });
    }
    console.log(responseArray);
    totalMessage(totalHits);
    return responseArray;
    // return request.data;
  }
  getImage().then(() => {
    createCardImage(responseArray);
    galleryDesk.innerHTML = markup;
    galleryLightBox();
  });
});
function createCardImage(responseArray) {
  return (markup = responseArray
    .map(
      arrItem => `       
      <a class="image-link" href="${arrItem.largeImageURL}">
        <div class="photo-card">
        <img class="gallery-image" src="${arrItem.webformatURL}" alt="${arrItem.tags}" loading="lazy"/>
        
<div class="info">
<ul>
<li><p class="info-item"><b>Likes</b></p><p>${arrItem.likes}</p></li>
<li><p class="info-item"><b>Views</b></p><p>${arrItem.views}</p></li>
<li><p class="info-item"><b>Comments</b></p><p>${arrItem.comments}</p></li>
<li><p class="info-item"><b>Downloads</b></p><p>${arrItem.downloads}</p></li>
</ul>
</div>
        </div>
        </a>
        `
    )
    .join(''));
}


function galleryLightBox() {
  return new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function emptyMessage() {
  Notiflix.Notify.info(`${emptyRequest}`);
}

function endMessage() {
  Notiflix.Notify.info(`${endOfRequest}`);
}

function totalMessage(totalHits) {
  Notiflix.Notify.info(`'Hooray! We found ${totalHits} images.'`);
}