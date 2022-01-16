const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password-signup');
const togglePassword2 = document.querySelector('#togglePassword2');
const password2 = document.querySelector('#password2-signup');

togglePassword.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  password2.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
  togglePassword2.classList.toggle('fa-eye-slash');
});

togglePassword2.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = password2.getAttribute('type') === 'password' ? 'text' : 'password';
  password2.setAttribute('type', type);
  password.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
  togglePassword.classList.toggle('fa-eye-slash');
});

function validateForm() {
  var pass1 = document.forms["signupform"]["UserPass"].value;
  var pass2 = document.forms["signupform"]["UserPass2"].value;
  
  if ((pass1 !== pass2) || pass1=='') {
    alert("Δεν ταιριάζουν οι κωδικοί!");
    return false;
  }
  if (document.forms["signupform"]["UserEmail"].value=='' && document.forms["signupform"]["LibPhone1"].value=='') {
    alert("Εισάγεται email ή τηλέφωνο!");
    return false;
  }
}