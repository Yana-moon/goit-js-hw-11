
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';


const userId = '33912044-22b2651672bec86fc9e274e80';
const requestUrl = 'https://pixabay.com/api/?';

const emptyRequest =
  'Sorry, there are no images matching your search query. Please try again.';
const endOfRequest =
  "We're sorry, but you've reached the end of search results.";

const formRequest = document.querySelector('#search-form');
const galleryDesk = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

let numPage = 1;
const per_page = 40;
let totalHits = 0;
let lightbox = '';


formRequest.addEventListener('submit', async e => {
  e.preventDefault();
  loadBtn.classList.add('visually-hidden');
  numPage = 1;
  galleryDesk.replaceChildren();
  await createCardImage();
  console.log(totalHits);
  if (Number(totalHits) > 40) {
    loadBtn.classList.remove('visually-hidden');
    Notiflix.Notify.success(`'Hooray! We found ${totalHits} images.'`);
  } else if (Number(totalHits) !== 0) {
    Notiflix.Notify.success(`'Hooray! We found ${totalHits} images.'`);
  } else emptyMessage();
  galleryLightBox();
});


loadBtn.addEventListener('click', addMarkupImages);

//////////// Запрос на бекенд///////////////
async function getImages(findText) {
  try {
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
    return request.data;
  } catch (error) {
    emptyMessage();
    console.error(error);
  }
}


async function createMarkupImages() {
  const findText = formRequest.elements.searchQuery.value.trim();
  const response = await getImages(findText);
  totalHits = response.totalHits;
  const arrayImages = [];
  for (const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } of response.hits) {
    arrayImages.push({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    });
  }
  return arrayImages;
}


async function createCardImage() {
  const arrayImages = await createMarkupImages();
  const markup = arrayImages
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
    .join('');
  galleryDesk.insertAdjacentHTML('beforeend', markup);
}


function galleryLightBox() {
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}


async function addMarkupImages() {
  numPage += 1;
  if (numPage > totalHits / per_page) {
    endMessage();
    loadBtn.classList.add('visually-hidden');
  }
  await createCardImage();
  lightbox.refresh();
}

function emptyMessage() {
  Notiflix.Notify.failure(`${emptyRequest}`);
}

function endMessage() {
  Notiflix.Notify.info(`${endOfRequest}`);
}
