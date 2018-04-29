let reviewButtons = document.querySelectorAll(".review .review__more");

reviewButtons.forEach(button => { 
	button.addEventListener("click", () => {
		var ele = button.parentElement.querySelector(".review__extra");
		var height = ele.scrollHeight;

		if (!ele.classList.contains("review__extra--open")) {
			ele.style.height = height + "px";
			ele.classList.add("review__extra--open");
			ele.style.height = "auto";

			button.textContent = "Show Less";
		} else {
			ele.style.height = height;
			ele.style.height = "0px";
			ele.classList.remove("review__extra--open");
			button.textContent = "Show More";
		}
	});
});