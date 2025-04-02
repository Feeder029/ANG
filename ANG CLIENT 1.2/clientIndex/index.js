document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".sidebar ul button");
    const iframe = document.querySelector("iframe");
    
    // Set default active link and iframe source if none is active
    if (!document.querySelector(".sidebar ul button.active")) {
        links[0].classList.add("active");
        iframe.src = links[0].getAttribute("href");
    }
    
    // Add click event listeners to each sidebar button
    links.forEach(link => {
        link.addEventListener("click", function (event) {
            // Remove active class from all links
            links.forEach(l => l.classList.remove("active"));
            
            // Add active class to clicked link
            this.classList.add("active");
            
            // Update iframe source
            iframe.src = this.getAttribute("href");
            
            // Prevent default link behavior
            event.preventDefault();
        });
    });

    
});


