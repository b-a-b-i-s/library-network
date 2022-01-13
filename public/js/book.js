
window.addEventListener("load", () => {
    const modalavail = document.querySelector("#borrow-available");
    const btnin = document.querySelector(".hold-btn");
    const spanin = document.querySelectorAll(".close-sign");

    let bookId=-1;
    let bookLibraryId=-1;

    
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

    // const nameInSubs = document.querySelector('#sub-name')


    btnin.addEventListener('click', (el)=> {
            modalavail.style.display = "block";
            console.log(userId);
            // nameInSubs.textContent = `${el.target.dataset.userName} [${el.target.dataset.userId}]`
            bookId = Number(el.target.dataset.bookId)
            bookLibraryId = Number(el.target.dataset.bookLibraryId)
        })


      


    // .onclick = function () {
        
    // }




    spanin.forEach(item=>{
        item.onclick = function () {
            modalavail.style.display = "none";

        }
    })
    

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
        if (event.target == modalavail) {
            modalavail.style.display = "none";

            // resetFields()
        }

        // if (event.target == modalup) {
        //     modalup.style.display = "none";
        // }
    }
})

