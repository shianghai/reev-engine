import BaseApi from "../../../classes/base_api.js";
import { GetSchemaData } from "../../../utils/schema_utils.js";
import { Schema } from "mongoose";

//schema defintition of the api for quick reference
const TmdbSchema = new Schema({
    poster_path: String,
    adult: Boolean,
    overview: String,
    release_date: String,
    original_title: String,
    genre_ids: Array,
    id: Array,
    media_type: String,
    original_language: String,
    title: String,
    backdrop_path: String || null,
    popularity: Number,
    vote_count: Number,
    video: Boolean,
    vote_average: Number,   
});

class Tmdb extends BaseApi{
    constructor(apiKey, baseUrl, query) {
        const url = baseUrl
        super(url);
        this.apiKey = apiKey;
        this.query = encodeURIComponent(query);
        this.page = 1;
        this.baseURL = baseUrl;     
    }

    handleTmdbError(error){
            if(error.status_code){
                switch(error.status_code){
                    case 7:
                        //handle "Invalid API key: You must be granted a valid key." error,
                        console.error(`Tmdb api error: ${error.status_message}`);
                        break;
                    case 34:
                        // handle "The resource you requested could not be found.", error
                        console.error(`Tmdb api error: ${error.status_message}`);
                        break;
                    case 22: 
                        console.error(`Tmdb Api Error: ${error.status_message}`);
                        break;
                    default: 
                        console.error(`Tmdb Api Error: ${error}`)
                        break;
                }
            }
    }

    async searchMovie(page){

        try {
            const url = `/search/movie?api_key=${this.apiKey}&language=en-US&query=${this.query}&page=${page}&include_adult=false`;
            const response = await super.makeRequest(url);
            return response;            
        }
        catch(error){
            //throw the error which will be caught by the caller who then passes the error to handleError method
            throw error;
        }
    }

    async searchPeople(page){
       try{
        const url = `/search/people?api_key=${this.apiKey}&language=en-US&query=${this.query}&page=${page}&include_adult=false`;
        const response = await super.makeRequest(url);
        return response;
       }
       catch(error){
        throw error
       }
    }

    async searchTvShow(page){
        try{
            const url = `/search/tv?api_key=${this.apiKey}&language=en-US&query=${this.query}&page=${page}&include_adult=false`;
            const response = await super.makeRequest(url);
            return response
        }
        catch(error) {
            throw error;
        }
    }

    async getMovieRating(movie_id){
        try{
            const url = `/movie/${movie_id}/reviews?api_key=${this.apiKey}&language=en-US&page=1`;
            const response = await super.makeRequest(url);
            return response;
        }
        catch(error){
            throw error;
        }
    }

    async getMovieGenres(){
        try{
            const url = `/genre/movie/list?api_key=${this.apiKey}&language=en-US`
            const response = await super.makeRequest(url);
            console.log('genre response', response)
            return response.data.genres;
        }
        catch(e){
            console.log('genre endpoint error:', e)
            throw e;
        }
    }

    async parseTmdbResponse(response, schemaMapper){
        //all api responses objects must have total page, results, total results and page fields
        if(response.results.length === 0){
            //if the response is empty, return an empty array
            return null
        }
        else {
           
        
        let result  = []; 
        GetSchemaData(response.results, schemaMapper)
        .map(async (resultObj)=>{
            
            //append base image url to poster_url to get a full url;
            //final solution is to download the image, save it to amazon s3 buckect or googleclound console and assign the link to poster path
            let path = resultObj['poster_url'];
            let fullPath = "https://image.tmdb.org/t/p/original/" + path;
            resultObj['poster_url'] = fullPath;

            //Get the actual movie genres using the array of movie genre ids
            const genre_ids = resultObj['genres'];
            if(genre_ids.length > 0){
                const genres = await this.getMovieGenres();
                const genre_dict = genres.reduce((acc, curr)=>{
                    acc[curr.id] = curr.name;
                    return acc;
                }, {});
                const genreNames = genre_ids.map(genre_id => genre_dict[genre_id]);
                resultObj['genres'] = genreNames;

           
            }
            result.push(resultObj);
        });

        return {
            results: result,
            currentPage: response.page,
            totalPages: this.getTotalPagesNumber(response)
        }
        }
    }

    getCurrentPageNumber(response){
        if(response){
            return response.page;
        }
        else return null;
    }

    getTotalPagesNumber(response){
        if(response){
            return response.total_pages;
        }
        else return 5;
    }
}

export default Tmdb;