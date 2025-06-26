const form = document.getElementById('loginForm');
const errorBox = document.getElementById('loginError');
const card = document.querySelector('.card');
const signupPrompt = document.getElementById('signupPrompt');

const token = localStorage.getItem('token');
const userData = localStorage.getItem('user');

if (token && userData) {
  const { name, email } = JSON.parse(userData);

  // Hide login form and signup prompt
  form.classList.add('d-none');
  if (signupPrompt) signupPrompt.classList.add('d-none');

  const avatar = document.createElement('div');
  avatar.className = 'text-center mb-3';
  avatar.innerHTML = `
  <a href="create.html" title="Go to Dashboard" class="profile-avatar-link d-inline-block">
    <i class="fas fa-user-circle"></i>
  </a>
`;

  // Welcome info
  const info = document.createElement('div');
  info.className = 'text-center mb-3';
  info.innerHTML = `
    <p class="mb-1 fw-semibold">Welcome, <span class="text-primary">${name}</span></p>
    <p class="small text-muted">${email}</p>
  `;

  // Dashboard + Logout buttons
  const actions = document.createElement('div');
  actions.className = 'd-flex flex-column gap-2';

  const dashboardBtn = document.createElement('a');
  dashboardBtn.href = 'create.html';
  dashboardBtn.className = 'btn btn-primary';
  dashboardBtn.textContent = 'Go to Dashboard';

  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Logout';
  logoutBtn.className = 'btn btn-outline-danger';
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  });

  actions.append(dashboardBtn, logoutBtn);
  card.append(avatar, info, actions);
} else {
  if (signupPrompt) signupPrompt.classList.remove('d-none');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
      const response = await fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || 'Login failed');
      }

      localStorage.setItem('token', result.data.accessToken);
      localStorage.setItem('user', JSON.stringify(result.data));

      window.location.href = 'create.html';
    } catch (err) {
      console.error('Login error:', err);
      errorBox.textContent = err.message;
      errorBox.classList.remove('d-none');
    }
  });
}
