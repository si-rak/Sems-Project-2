const token = localStorage.getItem('token');
const petList = document.getElementById('adminPetList');
const alertBox = document.getElementById('adminAlert');

let deletePetId = null;
let deletePetName = null;

if (!token) {
  alert('You must be logged in to access this page.');
  window.location.href = 'login.html';
}

async function fetchPets() {
  try {
    const res = await fetch('https://v2.api.noroff.dev/pets');
    const { data } = await res.json();

    petList.innerHTML = '';

    data.forEach((pet) => {
      const card = document.createElement('div');
      card.className = 'col-md-4';
      card.dataset.id = pet.id;
      card.innerHTML = `
        <div class="card shadow-sm h-100">
          <img src="${pet.image.url}" class="card-img-top" alt="${pet.name}" />
          <div class="card-body">
            <h5 class="card-title">${pet.name}</h5>
            <p class="card-text">${pet.breed || 'Unknown'} • ${
        pet.age || '?'
      } yrs</p>
            <a href="edit-pet.html?id=${
              pet.id
            }" class="btn btn-primary btn-sm me-2">Edit</a>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${
              pet.id
            }" data-name="${pet.name}">Delete</button>
          </div>
        </div>
      `;
      petList.appendChild(card);
    });
  } catch (err) {
    showAlert('Failed to load pets', 'danger');
  }
}

function showAlert(message, type) {
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  alertBox.classList.remove('d-none');

  setTimeout(() => {
    alertBox.classList.add('d-none');
  }, 3000);
}

// Handle delete button click
petList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    deletePetId = e.target.dataset.id;
    deletePetName = e.target.dataset.name;

    const nameSpan = document.getElementById('petToDeleteName');
    nameSpan.textContent = deletePetName;

    const modal = new bootstrap.Modal(
      document.getElementById('deleteConfirmModal')
    );
    modal.show();
  }
});

// Handle confirmed delete
document
  .getElementById('confirmDeleteBtn')
  .addEventListener('click', async () => {
    if (!deletePetId) return;

    try {
      const res = await fetch(`https://v2.api.noroff.dev/pets/${deletePetId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete');

      showAlert(`Deleted "${deletePetName}" successfully`, 'success');
      const modalInstance = bootstrap.Modal.getInstance(
        document.getElementById('deleteConfirmModal')
      );
      modalInstance.hide();

      fetchPets();
    } catch (err) {
      showAlert('Could not delete pet', 'danger');
    } finally {
      deletePetId = null;
      deletePetName = null;
    }
  });

fetchPets();
