import EventEmitter from "events";
import axios, { AxiosError } from "axios";
import retryWithBackoff from "../utils/axios_utils.js";


export default class EndPointHandler extends EventEmitter{
    
    constructor(apiInstance, endpointName, errorHandlerName, responseParserName, totalPagesGetterName, currentPageGetterName, responseListener, doneListener ){
        super(); 
        
        if(arguments.length === 2){
            this.apiInstance = apiInstance;
            this.endpointName = endpointName;
        } 
        else {
            this.apiInstance = apiInstance;
            this.endpointName = endpointName;
            this.errorHandlerName = errorHandlerName;
            this.responseParserName = responseParserName;
            this.responseListener = responseListener;
            this.doneListener = doneListener;
            this.totalPagesGetterName = totalPagesGetterName;
            this.currentPageGetterName = currentPageGetterName;

        }
        this.addListener('data', this.responseListener);
        this.addListener('done', this.doneListener);
    }

    async handleRequestMethod(pageNumber){
        let hasNextPage = true;
        let totalPages = 0;
        do{
            try{
                const response = await this.apiInstance[this.endpointName](pageNumber);

                if(response.status === 200){
                    
                    await this.responseEmitter(response.data)
                    //get total number of pages
                    totalPages = this.apiInstance[this.totalPagesGetterName](response.data)
                }

                else if(response.status === 404) throw response.data;

                else if( response.status === 408 || response.status === 429 || 
                    response.status === 500 || response.status === 502 ||  
                    response.status === 503
                )
                {
                    try{
                        console.log('\n response gotten from initial retry', response);
                        const response = await retryWithBackoff(()=>this.apiInstance[this.endpointName](pageNumber));
                        if(response.data){
                            this.responseEmitter(response.data);
                            totalPages = this.apiInstance[this.totalPagesGetterName](response.data)
                        }
                    }
                    catch(error){
                        console.log('error after 5 retries:', error)
                    }
                        
                }
                else{
                    throw response.data;
                }
            }
            catch(error){
                
                if(error.request){
                    //errors from the request side
                    // if(this.errorHandlerName){
                    //     this.apiInstance[this.errorHandlerName](error.request.data);
                    // } 
                    
                    console.log('No response handler provided to handle the request error: ', error.response);
                    
                    
                }
                else if(error.response){
                    //response errors
                    if(this.errorHandlerName){
                        this.apiInstance[this.errorHandlerName](error.response.data);
                    } 
                    else{
                        console.log('No response handler provided to handle the response error: ', error.response);
                    }

                }
            
                
            }
            pageNumber++;
            if(pageNumber > totalPages){
                hasNextPage = false;
                this.emit('done');
            }
            
        }
        while(hasNextPage);
    }

    async responseEmitter(response){
        const parsedResponse = this.apiInstance[this.responseParserName](response);
        if(parsedResponse) this.emit('data', parsedResponse);
    }

    
}
