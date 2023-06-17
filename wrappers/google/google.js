import BaseApi from '../../classes/base_api.js'


//TODO: the google api response contains more fields [eg: events].. Add them to the shema
class Google extends BaseApi{
    constructor(apiKey, baseUrl, query){
        super(baseUrl)
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.query = query;
    }

    async searchGoogle(page){
        const url = `/customsearch/v1?c2coff=1&cx=301080e09cd8a4f87&key=${this.apiKey}&exactTerms=${this.query}&start=${page}`;
        const response = await super.makeRequest(url);
        return response;
    }

    parseGoogleResponse(response){
        return {
            results: response.items,
            currentPage: this.getCurrentPage(response),
            totalPages: this.getTotalPages(response)
        }
    }

    handleGoogleError(error){
        switch(error.error.code){
            case 400:
                
                error.error.errors.forEach(element => {
                    switch (element.reason) {
                        case 'badRequest':
                            console.error('\x1b[36m%s\x1b[0m', 'Google Search Json Api restricts search to only 100 records');
                            
                            process.exit(1);
                    }
                    console.error(`Google Api Error: `, element);
                    
                });
        }
    }

    getTotalPages(response){
        return response.queries.request[0].totalResults;
    }

    getCurrentPage(response){
        return response.queries.request[0].startIndex;
    }

    getNextPage(response){
        return response.queries.nextPage[0].startIndex;
    }

}

export default Google;

//TODO: Turn on duplicate content filtering in the api url
