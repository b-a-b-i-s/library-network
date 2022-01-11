
window.addEventListener("load", () => {
    const modalin = document.querySelector("#new-lib-modal");
    const btnin = document.querySelector("#search-isbn");
    const spanin = document.querySelector(".close-sign");

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

    btnin.addEventListener('click', (el)=> {
        modalin.style.display = "block";
        // console.log(userId);
        //TODO : fetch
        let selectedBook = document.querySelectorAll('.book-for-transfer');
        // for (let i = 0 ; i<fetchedBooks.length; i++) {
        //     for (let j = 0 ; j<selectedBook.length; j++) {
        //         if (    //    fetchedBooks.isbn == selectedBook.dataset.isbn &&
        //             fetchedBooks.antitypo == selectedBook.dataset.antitypo &&
        //             fetchedBooks.libId == selectedBook.dataset.libId ) {
        //                 break;
        //             }
        //         if (j==selectedBook.length-1) {
        //             //TODO add button to add book

        //         }
        //     }

        // }
        // nameInSubs.textContent = `${el.target.dataset.userName} [${el.target.dataset.userId}]`
        // userId = Number(el.target.dataset.userId)

        document.querySelectorAll('.available-btn').forEach(item=> {
            item.onclick = function () {
                let newBook = document.createElement('tr')

                newBook.classList.add('book-for-transfer');
                newBook.dataset.isbn=item.dataset.isbn
                newBook.dataset.antitypo=item.dataset.antitypo
                newBook.dataset.libId=item.dataset.libId
                
                newBook.innerHTML =`
                            <td>${item.dataset.isbn}</td>
                            <td>${item.dataset.antitypo}</td>
                            <td>${item.dataset.libName}</td>
                `

                document.querySelector('#books-for-transfer').appendChild(newBook)

                modalin.style.display = "none";
                // el.target.dataset
            }
        })

        
    })
    
    // .onclick = function () {
        
    // }


    

    spanin.onclick = function () {
        modalin.style.display = "none";

        // resetFields()
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

            // resetFields()
        }
        // if (event.target == modalup) {
        //     modalup.style.display = "none";
        // }
    }
})

