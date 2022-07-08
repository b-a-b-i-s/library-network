window.addEventListener("load", () => {
    const modalinNav = document.getElementById("siginpmodalnew");
    const btninNav = document.getElementById("signinbtnnew");
    const spaninNav = document.querySelector("#close-sign-in");
    const modalupNav = document.getElementById("signupmodalnew");
    const linkupNav = document.getElementById("signupbtnnew");
    const spanupNav = document.querySelector("#close-sign-up");


    // const modalalertIndexNav = document.querySelector("#alert-modal");

    // if (modalalertIndexNav) {
    //     const alertbtnclose = document.querySelector("#close-sign-alert");
    //     alertbtnclose.onclick = () => {
    //         modalalertIndexNav.style.display = "none";
    //     }
    //     const alertbtnok = document.querySelector("#alert-btn");
    //     alertbtnok.onclick = () => {
    //         modalalertIndexNav.style.display = "none";
    //     }
    // }

    const modalalertNav = document.querySelector("#alert-modal");

    if (modalalertNav) {
        const alertbtnclose = document.querySelector(".close-sign-alert");
        alertbtnclose.onclick = () => {
            modalalertNav.style.display = "none";
        }
        const alertbtnokNav = document.querySelector("#alert-btn");
        alertbtnokNav.onclick = () => {
            modalalertNav.style.display = "none";
        }
    }

    btninNav.onclick = function () {
        modalinNav.style.display = "block";
    }
    spaninNav.onclick = function () {
        modalinNav.style.display = "none";
    }

    linkupNav.onclick = function () {
        modalupNav.style.display = "block";
    }

    spanupNav.onclick = function () {
        modalupNav.style.display = "none";
    }
    window.addEventListener('click', function (event) {
        // console.log(event)
        // if (event.target == modalalertIndexNav) {
        //     modalalertIndexNav.style.display = "none";
        //     return;
        // }
        if (event.target == modalalertNav) {
            modalalertNav.style.display = "none";
            return;
        }
        if (event.target == modalinNav) {
            modalinNav.style.display = "none";
        }
        if (event.target == modalupNav) {
            modalupNav.style.display = "none";
        }
    })


    const togglePasswordSignIn = document.querySelector('#togglePasswordSignIn');
    const passwordSignIn = document.querySelector('#password-signin');

    togglePasswordSignIn.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = passwordSignIn.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordSignIn.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
    });

    if (document.querySelector('#add-phone'))
    document.querySelector('#add-phone').addEventListener('click', function(el) {
        const phoneDivs = document.querySelectorAll('#phones>div');
        let newId;
        if (phoneDivs.length===0) {
            newId = 2;
        }
        else {
            newId = Number(phoneDivs[phoneDivs.length - 1].id.slice(-1)) + 1;
        }
        console.log(newId)
        const newPhone = document.createElement('div');
        newPhone.innerHTML = `
            <input type="text" name="LibPhone${newId}" id="lib-phone-${newId}" placeholder="Νέος αριθμός" style="width: 7.6em;">
            <i class="fas fa-times delete-phone" id="x${newId}"></i>`;
        newPhone.id = `phone-div-${newId}`
        newPhone.classList.add("extra-phone");
        document.querySelector('#phones').insertBefore(newPhone, el.target);
        document.querySelector(`#x${newId}`).addEventListener('click', function(el){
            console.log(`#phone-div-${newId}`);
            document.querySelector(`#phone-div-${newId}`).remove();
        })
        document.querySelector(`#lib-phone-${newId}`).focus();
        document.querySelector(`#lib-phone-${newId}`).select();
    
    })


    const togglePasswordSignUp = document.querySelector('#togglePassword');
    const passwordSignUp = document.querySelector('#password-signup');

    togglePasswordSignUp.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = passwordSignUp.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordSignUp.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
    });
})

