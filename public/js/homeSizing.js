let container = document.querySelector(".full-screen");

function resizeHome(){
	let windowHeight = window.innerHeight;
	let navigationHeight = document.querySelector("nav").offsetHeight;

	container.style.height = (windowHeight - navigationHeight) + "px";
}

resizeHome();

window.addEventListener("resize", () => {
	resizeHome();
});	