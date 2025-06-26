const form = document.getElementById('createPetForm');
const alertBox = document.getElementById('formAlert');

// Check if admin is logged in
const token = localStorage.getItem('token');

if (!token) {
  alert('You must be logged in to access this page.');
  window.location.href = 'login.html';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newPet = {
    name: form.name.value.trim(),
    species: form.species.value.trim(),
    breed: form.breed.value.trim(),
    age: parseInt(form.age.value) || null,
    description: form.description.value.trim(),
    image: {
      url: form.imageUrl.value.trim(),
      alt: form.name.value.trim(),
    },
  };

  try {
    const response = await fetch('https://v2.api.noroff.dev/pets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPet),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errors?.[0]?.message || 'Failed to create pet');
    }

    alertBox.className = 'alert alert-success mt-3';
    alertBox.textContent = `Pet "${result.data.name}" added successfully!`;
    alertBox.classList.remove('d-none');

    form.reset();
  } catch (err) {
    alertBox.className = 'alert alert-danger mt-3';
    alertBox.textContent = err.message;
    alertBox.classList.remove('d-none');
  }
});
