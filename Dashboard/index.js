document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".side-bar ul button");
    const iframe = document.querySelector("iframe");

    if (!document.querySelector(".side-bar ul button.active")) {
        links[0].classList.add("active");
        iframe.src = "../Dashboard/Dashboard/Dashboard.html"; 
    }

    links.forEach(link => {
        link.addEventListener("click", function (event) {

            links.forEach(l => l.classList.remove("active"));

            this.classList.add("active");

            iframe.src = this.getAttribute("href");

            event.preventDefault();
        });
    });
});
