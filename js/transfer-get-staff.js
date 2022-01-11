
window.addEventListener("load", () => {
    const modalInfo = document.querySelectorAll(".modal-transfer-info");
    const btnInfo = document.querySelectorAll(".show-transfer-btn");
    const spanInfo = document.querySelectorAll(".close-sign-transfer");

    let bookisbn=-1;

    
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

    for (let i = 0; i<btnInfo.length; i++) {
        btnInfo[i].addEventListener('click', (el)=> {
            modalInfo[i].style.display = "block";            
        })

        spanInfo[i].onclick = function () {
            modalInfo[i].style.display = "none";

            // resetFields()
        }
    }

    
    
    // .onclick = function () {
        
    // }


    

    

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

        for (let i=0; i<modalInfo.length; i++) {
            if (event.target == modalInfo[i]) {
                modalInfo[i].style.display = "none";

                // resetFields()
            }
        }

            
        // if (event.target == modalup) {
        //     modalup.style.display = "none";
        // }
    }
})

