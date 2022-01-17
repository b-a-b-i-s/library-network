window.addEventListener("load", () => {


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
    })
})
