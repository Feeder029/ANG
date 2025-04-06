const actionsBtn = document.getElementById("actions");
const actionMenu = document.querySelector(".action-menu");

actionsBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    actionMenu.classList.toggle("hidden");
});

document.addEventListener("click", function () {
    actionMenu.classList.add("hidden");
});