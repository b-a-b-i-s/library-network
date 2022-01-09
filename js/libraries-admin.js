window.addEventListener("load", () => {
    const modalin = document.querySelector("#new-lib-modal");
    const btnin = document.querySelector("#new-lib-btn");
    const spanin = document.querySelector(".close-sign");
    
    // const modalup = document.getElementById("signupmodal");
    // const linkup = document.getElementById("signuplink");
    // const spanup = document.getElementsByClassName("close-sign")[1];


    const modalalertIndex = document.querySelector("#alert-modal-index");

    if (modalalertIndex) {
        const alertbtnclose = document.querySelector("#close-sign-alert-index");
        alertbtnclose.onclick = () => {
            modalalertIndex.style.display = "none";
        }
        const alertbtnok = document.querySelector("#alert-btn-index");
        alertbtnok.onclick = () => {
            modalalertIndex.style.display = "none";
        }
    }

    const modalalert = document.querySelector("#alert-modal");

    if (modalalert) {
        const alertbtnclose = document.querySelector(".close-sign-alert");
        alertbtnclose.onclick = () => {
            modalalert.style.display = "none";
        }
        const alertbtnok = document.querySelector("#alert-btn");
        alertbtnok.onclick = () => {
            modalalert.style.display = "none";
        }
    }

    btnin.onclick = function () {
        modalin.style.display = "block";
    }

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
            <input type="text" name="lib-phone-${newId}" id="lib-phone-${newId}" placeholder="Νέος αριθμός" style="width: 7.6em;">
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

    function resetFields() {
        document.querySelectorAll('.extra-phone').forEach(element => {
            element.remove()
        });

        document.querySelectorAll('.new-library input').forEach(element => {
            console.log(element);
            element.value = ''
        });


    }

    spanin.onclick = function () {
        modalin.style.display = "none";

        resetFields()
    }

    // linkup.onclick = function () {
    //     modalup.style.display = "block";
    // }

    // spanup.onclick = function () {
    //     modalup.style.display = "none";
    // }
    window.onclick = function (event) {
        // console.log(event)
        if (event.target == modalalertIndex) {
            modalalertIndex.style.display = "none";
            return;
        }
        if (event.target == modalalert) {
            modalalert.style.display = "none";
            return;
        }
        if (event.target == modalin) {
            modalin.style.display = "none";

            resetFields()
        }
        // if (event.target == modalup) {
        //     modalup.style.display = "none";
        // }
    }
})

