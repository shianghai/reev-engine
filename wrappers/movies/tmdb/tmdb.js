import BaseApi from "../../../classes/base_api.js";


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
            switch(error.status_code){
                case 7:
                    //handle "Invalid API key: You must be granted a valid key." error,
                    console.error(`Tmdb api error: ${error.status_message}`);
                    break;
                case 34:
                    // handle "The resource you requested could not be found.", error
                    console.error(`Tmdb api error: ${error.status_message}`);
                    break;
                default: break;
            }
    }

    async searchMovie(){
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
        const response = await this.makeRequest(url);
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
            const response = await this.makeRequest(url);
            return response;
        }
        catch(error){
            throw error;
        }
    }

    parseTmdbResponse(response){
        //all api responses objects must have total page, results, total results and page fields
        if(response.results.length === 0){
            //if the response is empty, return an empty array
            return null
        }
        else {
            return {
                results: response.results,
                page: response.page,
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
        else return null;
    }
}

export default Tmdb;