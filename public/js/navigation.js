let navOpen = document.querySelector(".nav__open");
let navClose = document.querySelector(".nav__close");

let navItems = document.querySelector(".nav__items");

navClose.addEventListener("click", () => {
	navItems.style.visibility = "hidden";

	document.body.style.overflow = "visible";
});

navOpen.addEventListener("click", () => {
	navItems.style.visibility = "visible";

	document.body.style.overflow = "hidden";
});