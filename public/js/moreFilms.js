const INCREMENT = 5;

function wantMore(){
	const filmsList = document.querySelector(".films-list--want");
	let films = filmsList.querySelectorAll(".basic-card");

	let numShown = [...films].filter(film =>{return !film.classList.contains("hidden")}).length;
	let numRemaining = [...films].filter(film =>{return film.classList.contains("hidden")}).length;

	let end = (numRemaining > INCREMENT) ? INCREMENT : numRemaining;

	for(let i = 0; i < end; i++){
		let film = films.item(numShown + i);
		film.classList.remove("hidden");
	}

	let hiddenFilms = filmsList.querySelectorAll(".basic-card:not(.hidden)");
	if(hiddenFilms.length == films.length){
		document.querySelector(".want-more").classList.add("btn--hidden");
	}

}


function watchedMore(){
	const filmsList = document.querySelector(".films-list--watched");
	let films = filmsList.querySelectorAll(".basic-card");

	let numShown = [...films].filter(film =>{return !film.classList.contains("hidden")}).length;
	let numRemaining = [...films].filter(film =>{return film.classList.contains("hidden")}).length;

	let end = (numRemaining > INCREMENT) ? INCREMENT : numRemaining;

	for(let i = 0; i < end; i++){
		let film = films.item(numShown + i);
		film.classList.remove("hidden");
	}

	let hiddenFilms = filmsList.querySelectorAll(".basic-card:not(.hidden)");
	if(hiddenFilms.length == films.length){
		document.querySelector(".watched-more").classList.add("btn--hidden");
	}

}