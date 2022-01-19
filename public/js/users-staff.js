
window.addEventListener("load", () => {
    const modalin = document.querySelector("#new-lib-modal");
    const btnin = document.querySelectorAll(".new-sub");
    const spanin = document.querySelector(".close-sign");

    let userId=-1;

    
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

    const nameInSubs = document.querySelector('#sub-name')
    const usrIdInp = document.querySelectorAll('.inp-id')

    btnin.forEach(item => {
        item.addEventListener('click', (el)=> {
            modalin.style.display = "block";
            console.log(userId);
            nameInSubs.textContent = `${el.target.dataset.userName} [${el.target.dataset.userId}]`
            usrIdInp.forEach(item=>item.value=el.target.dataset.userId)
            userId = Number(el.target.dataset.userId)
            
        })
    })
    // .onclick = function () {
        
    // }


    

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

