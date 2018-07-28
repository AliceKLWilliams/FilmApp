const links = document.querySelectorAll(".slider__link");
const sections = document.querySelectorAll(".slider__content");

links.forEach(link => {
	link.addEventListener("click", () => {
		const name = link.dataset.name;
		const content = document.querySelector(`.slider__content[data-name=${name}]`);
		
		content.classList.add("slider__content--show");

		sections.forEach(section => {
			if(section != content){
				section.classList.remove("slider__content--show");
				section.classList.add("slider__content--hidden");
			}
		});
	});
});