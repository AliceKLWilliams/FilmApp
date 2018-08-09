const links = document.querySelectorAll(".slider__link");
const sections = document.querySelectorAll(".slider__content");
const underline = document.querySelector(".slider__underline");

let initialLeft = links[0].getBoundingClientRect().left;
underline.style.width = links[0].getBoundingClientRect().width + "px";


links.forEach(link => {
	link.addEventListener("click", () => {
		const name = link.dataset.name;
		const content = document.querySelector(`.slider__content[data-name=${name}]`); // Get content for the link
		
		content.classList.add("slider__content--show");

		const linkBoundingBox = link.getBoundingClientRect();

		underline.style.left = (linkBoundingBox.left - initialLeft) + "px";
		underline.style.width = linkBoundingBox.width + "px";

		// Clean up classes
		sections.forEach(section => {
			if(section != content){
				section.classList.remove("slider__content--show");
				section.classList.add("slider__content--hidden");
			}
		});
	});
});

window.addEventListener("resize", () => {
	initialLeft = links[0].getBoundingClientRect().left;
});