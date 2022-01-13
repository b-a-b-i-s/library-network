const togglePasswordSignUp = document.querySelector('#togglePassword');
const passwordSignUp = document.querySelector('#password-signup');

togglePasswordSignUp.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = passwordSignUp.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordSignUp.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});


