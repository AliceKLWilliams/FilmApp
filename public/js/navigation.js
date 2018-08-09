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

navItems.addEventListener("keydown", (e) => {
	let tabPressed = (e.key == "Tab" || e.keyCode == 9);

	if(!tabPressed){
		return;
	}

	const items = navItems.querySelectorAll("a, button");

	const first = items[0];
	const last = items[items.length-1];

	if(e.shiftKey){
		if(document.activeElement == first){
			last.focus();
			e.preventDefault();
		}
	} else{
		if(document.activeElement == last){
			first.focus();
			e.preventDefault();
		}
	}
});