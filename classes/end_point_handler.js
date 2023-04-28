import EventEmitter from "events";
import axios, { AxiosError } from "axios";
import retryWithBackoff from "../utils/axios_utils.js";


export default class EndPointHandler extends EventEmitter{
    
    constructor(apiInstance, endpointName, errorHandlerName, responseParserName, totalPagesGetterName, currentPageGetterName, responseListener, doneListener){
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
            

            this.savedListener = function(currentPage, totalPages){
                //increase the page count and make the request again
                this.handleRequestMethod(currentPage + 1, totalPages)
            }

        }
        this.addListener('data', this.responseListener);
        this.addListener('done', this.doneListener);
        this.addListener('saved', this.savedListener)
    }

    async handleRequestMethod(pageNumber, totalPages){ 
            if(pageNumber > totalPages){
                this.emit('done')
            } 
            else{
                try{
                    const response = await this.apiInstance[this.endpointName](pageNumber);
                    
    
                    if(response.status === 200){
                        
                        
                        //get total number of pages
                           
                           await this.responseEmitter(response.data);
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
                                await this.responseEmitter(response.data);
                                
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
                        console.log('Axios Error:', error.code, error.message);  
                        this.emit('done')
                                   
                    }
                    if(error.response){
                        //response errors
                        if(this.errorHandlerName){
                            this.apiInstance[this.errorHandlerName](error.response.data);
                            this.emit('done')
                        } 
                        else{
                            console.log('No response handler provided to handle the response error: ', error.response);
                            this.emit('done');
                        }
    
                    }
                
                    
                }
            }
            
           
            
        
        
    }

    async responseEmitter(response){
        //add currentPage and totalPages to the response
        const parsedResponse = this.apiInstance[this.responseParserName](response);
        //console.log('parsedResponse', parsedResponse.result)
        if(parsedResponse) this.emit('data', parsedResponse);
    }  
}
