const loginForm = document.querySelector('#loginForm');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const togglePassword = document.querySelector('#togglePassword');
const formMessage = document.querySelector('#formMessage');

togglePassword.addEventListener('click', () => {
  const showing = password.type === 'text';
  password.type = showing ? 'password' : 'text';
  togglePassword.textContent = showing ? 'Show' : 'Hide';
  togglePassword.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!email.validity.valid || password.value.length < 6) {
    formMessage.textContent = 'Please enter a valid email and a password of at least 6 characters.';
    formMessage.className = 'form-message error';
    return;
  }

  formMessage.textContent = 'Demo login successful! Redirecting…';
  formMessage.className = 'form-message success';

  window.setTimeout(() => {
    window.location.href = 'index.html';
  }, 900);
});
