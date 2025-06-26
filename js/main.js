const petList = document.getElementById('pet-list');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const retryBtn = document.getElementById('retry');

const API_URL = 'https://v2.api.noroff.dev/pets';

async function fetchPets() {
  loading.classList.remove('d-none');
  error.classList.add('d-none');
  petList.innerHTML = '';

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('API error');

    const { data } = await res.json();

    loading.classList.add('d-none');

    data.forEach((pet) => {
      const col = document.createElement('div');
      col.className = 'col-sm-6 col-md-4 col-lg-3';
      col.innerHTML = `
        <div class="card h-100">
          <img src="${pet.image.url}" class="card-img-top" alt="${pet.name}">
          <div class="card-body">
            <h5 class="card-title">${pet.name}</h5>
            <p class="card-text">${pet.breed || 'Unknown'} • ${
        pet.age || '?'
      } yrs</p>
          </div>
        </div>
      `;
      petList.appendChild(col);
    });
  } catch (err) {
    loading.classList.add('d-none');
    error.classList.remove('d-none');
    console.error('Error fetching pets:', err);
  }
}

retryBtn.addEventListener('click', fetchPets);
fetchPets();
