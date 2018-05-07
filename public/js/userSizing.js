let user = document.querySelector(".user");
let list = document.querySelector(".list-container");


function resizeImage(){
	let profilePic = user.querySelector(".user__image-container");
	profilePic.style.height = profilePic.offsetWidth + "px";
}

resizeImage()

window.addEventListener("resize", () => {
	resizeImage();
});