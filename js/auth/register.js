const form = document.getElementById('registerForm');
const errorBox = document.getElementById('registerError');
const successBox = document.getElementById('registerSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;

  try {
    const response = await fetch('https://v2.api.noroff.dev/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errors?.[0]?.message || 'Registration failed');
    }

    successBox.textContent = `Welcome, ${result.data.name}! You can now log in.`;
    successBox.classList.remove('d-none');
    errorBox.classList.add('d-none');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove('d-none');
    successBox.classList.add('d-none');
  }
});
