import BaseApi from "../../classes/base_api";


class Google extends BaseApi{
    constructor(baseUrl, apiKey, query){
        super(baseUrl)
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.query = query;
    }

    async searchGoogle(page){
        const url = `key=${this.apiKey}&cx=017576662512468239146:omuauf_lfve&q=${this.query}`;
        const response = await super.makeRequest(url);
        return response;
    }

    async parseGoogleResponse(response){
        return {
            results: response.items,
            currentPage: this.getCurrentPage(response),
            totalPages: this.getTotalPagesNumber(response)
        }
    }

    async handleGoogleError(error){

    }

    async getTotalPages(response){
        return response.queries.request[0].totalResults;
    }

    async getCurrentPage(response){
        return response.queries.request[0].startIndex;
    }

}

export default Google;