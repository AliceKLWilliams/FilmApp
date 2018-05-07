let user = document.querySelector(".user");
let list = document.querySelector(".list-container");

function resizeContainers(){
	let userParent = user.parentElement;
	
	if(document.body.clientWidth > 640){
		user.classList.remove("user--full");
		list.classList.remove("list-container--full");

		let newWidth = userParent.offsetWidth * 0.25;
		user.style.width = newWidth + "px";
		list.style.left = newWidth + 30 + "px";
	} else{
		user.style.width = null;
		list.style.left = null;

		user.classList.add("user--full");
		list.classList.add("list-container--full");
	}
	
}

function resizeImage(){
	let profilePic = user.querySelector(".user__image-container");
	profilePic.style.height = profilePic.offsetWidth + "px";
}

resizeContainers();
resizeImage()

window.addEventListener("resize", () => {
	resizeContainers();
	resizeImage();
});