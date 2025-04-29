function DisplayServices() {
    fetch("Service.php?action=getservices")
        .then(response => response.json())
        .then(data => {
            let display = "";
            
            data.forEach(item => {
                display += `
                <div class="service-card">
                    <div class="card">
                        <button class="actions-btn" id="actions">...</button>
                        <div class="action-menu hidden">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <i class="fa-solid fa-trash"></i>
                        </div>
                        <div class="card-left">
                            <i class="fa-solid fa-tooth"></i>
                        </div>
                        <div class="card-right">
                            <h1>${item.SER_Name}</h1>
                            <h4 id="duration">Duration: <span>${item.SER_Duration}</span></h4>
                            <!-- <h4 id="price">Price: <span>₱ 300</span></h4> -->
                        </div>
                    </div>
                    <div class="card-bot">
                        <h3>${item.SER_Details}</h3>
                    </div>
                </div>
                `;
            });

            document.getElementById('services_container').innerHTML = display;
            
            // Add event listeners AFTER the elements are added to the DOM
            const actionBtns = document.querySelectorAll(".actions-btn");
            
            actionBtns.forEach(btn => {
                btn.addEventListener("click", function(e) {
                    e.stopPropagation();
                    
                    // Close all other menus first
                    document.querySelectorAll(".action-menu").forEach(menu => {
                        if (menu !== this.nextElementSibling) {
                            menu.classList.add("hidden");
                        }
                    });
                    
                    // Toggle this menu
                    this.nextElementSibling.classList.toggle("hidden");
                });
            });
            
            // Close menus when clicking elsewhere
            document.addEventListener("click", function() {
                document.querySelectorAll(".action-menu").forEach(menu => {
                    menu.classList.add("hidden");
                });
            });
            
        })
        .catch(error => console.error('Error fetching Service.php data:', error));
}

DisplayServices();