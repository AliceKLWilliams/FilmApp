let fetch = require("node-fetch");

require("dotenv").config();
const APIKey = process.env.APIKEY;

const URL = `http://www.omdbapi.com/?apikey=${APIKey}`;

module.exports = {
    SearchFilm(filmName, page){
        let searchURL = URL+"&s="+filmName+"&page="+page+"&type=movie";
        return new Promise((resolve, reject) => {
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
    },


    GetShortPlots (IDs){
        let promises = [];
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
    },

        
    SearchID(ID, plot){

        let searchURL = URL+"&plot="+plot+"&i="+ID;
        return new Promise((resolve, reject) => {
            fetch(searchURL)
            .then(response => response.json())
            .then(APIData => {
                if(APIData.Poster == "N/A"){
                    APIData.Poster = "/pics/poster-placeholder.png";
                }
                resolve(APIData);
            }).catch(error => {
                reject(error);
            });
        });
    },



    GetBasicInfo (IDs){
        let promises = []
        for(let i = 0; i < IDs.length; i++){ 
            promises.push(this.SearchID(IDs[i], "short"));
        }
        let basicData = [];

        return new Promise((resolve, reject) =>{
            Promise.all(promises)
            .then(films => {
                films.forEach(film =>{
                    basicData.push({
                        imdbID:film.imdbID,
                        title:film.Title,
                        year:film.Year,
                        poster: film.Poster
                    });
                });
                resolve(basicData);
            })
            .catch(error =>{
                reject(error);
            });
        });
    }
}