const togglePasswordStaff = document.querySelector('#togglePasswordStaff');
        const passwordStaff = document.querySelector('#password-sign');

        togglePasswordStaff.addEventListener('click', function (e) {
        // toggle the type attribute
        const type = passwordStaff.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordStaff.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
        });