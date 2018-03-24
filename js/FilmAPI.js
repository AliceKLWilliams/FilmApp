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
                resolve(data);
            })
            .catch(error => {
                reject(err);
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
}
