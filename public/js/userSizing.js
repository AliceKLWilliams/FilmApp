let user = document.querySelector(".user");
let list = document.querySelector(".list-container");

function resizeUser(){
	let userParent = user.parentElement;
	
	if(document.body.clientWidth > 640){
		user.classList.remove("user--full");
		list.classList.remove("list-container--full");

		let newWidth = userParent.offsetWidth * 0.3;
		user.style.width = newWidth + "px";
		list.style.left = newWidth + 10 + "px";
	} else{
		user.style.width = null;
		list.style.left = null;

		user.classList.add("user--full");
		list.classList.add("list-container--full");
	}
	
}

resizeUser();

window.addEventListener("resize", () => {
	resizeUser();
});