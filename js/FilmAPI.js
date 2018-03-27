let fetch = require("node-fetch");

module.exports = class FilmAPI{
    constructor(key){
        this.URL = "http://www.omdbapi.com/?apikey="+key;
    }

    SearchFilm(filmName, page){
        let searchURL = this.URL+"&s="+filmName+"&page="+page+"&type=movie";
        return new Promise(function(resolve, reject){
            fetch(searchURL)
            .then(response => response.json())
            .then(data => {
                if(data.Response == 'True'){
                    resolve(data);
                } else{
                    reject(data.Error);
                }
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    SearchID(ID, plot){
        let searchURL = this.URL+"&plot="+plot+"&i="+ID;
        return new Promise(function(resolve, reject){
            fetch(searchURL)
            .then(response => response.json())
            .then(APIData => {
                resolve(APIData);
            }).catch(error => {
                reject(error);
            });
        });
    }

    GetShortPlots(IDs){
        let promises = []
        for(let i = 0; i < IDs.length; i++){
            promises.push(this.SearchID(IDs[i], "short"));
        }
        let plots = [];

        return new Promise((resolve, reject) => {
            Promise.all(promises)
            .then(films => {
                films.forEach(film => {
                    plots.push(film.Plot);
                });
                resolve(plots);
            })
            .catch(error =>{
                reject(error);
            });
        });
    }
}
