const token = localStorage.getItem("token");
const urlParams = new URLSearchParams(window.location.search);
const petId = urlParams.get("id");
const form = document.getElementById("editPetForm");
const alertBox = document.getElementById("formAlert");

if (!token) {
  alert("You must be logged in to access this page.");
  window.location.href = "login.html";
}

if (!petId) {
  alert("No pet ID provided.");
  window.location.href = "edit.html";
}

async function loadPet() {
  try {
    const res = await fetch(`https://v2.api.noroff.dev/pets/${petId}`);
    const { data } = await res.json();

    form.name.value = data.name || "";
    form.species.value = data.species || "";
    form.breed.value = data.breed || "";
    form.age.value = data.age || "";
    form.imageUrl.value = data.image?.url || "";
    form.description.value = data.description || "";

  } catch (err) {
    showAlert("Failed to load pet data", "danger");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedPet = {
    name: form.name.value.trim(),
    species: form.species.value.trim(),
    breed: form.breed.value.trim(),
    age: parseInt(form.age.value) || null,
    description: form.description.value.trim(),
    image: {
      url: form.imageUrl.value.trim(),
      alt: form.name.value.trim()
    }
  };

  try {
    const res = await fetch(`https://v2.api.noroff.dev/pets/${petId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPet)
    });

    if (!res.ok) throw new Error("Update failed");

    showAlert("Pet updated successfully!", "success");

  } catch (err) {
    showAlert(err.message, "danger");
  }
});

function showAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type} mt-3`;
  alertBox.classList.remove("d-none");

  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 3000);
}

loadPet();
