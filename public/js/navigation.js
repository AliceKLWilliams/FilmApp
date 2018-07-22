let navOpen = document.querySelector(".nav__open");
let navClose = document.querySelector(".nav__close");

let navItems = document.querySelector(".nav__items");

navClose.addEventListener("click", () => {
	navItems.style.visibility = "hidden";
});

navOpen.addEventListener("click", () => {
	navItems.style.visibility = "visible";
});