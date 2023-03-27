import EventEmitter from "events";
import axios, { AxiosError } from "axios";

export default class EndPointHandler extends EventEmitter{
    
    constructor(apiInstance, endpointName, errorHandlerName, responseParserName, responseListener, itemNotFoundListener){
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
            this.itemNotFoundListener = itemNotFoundListener;
        }
        this.addListener('data', this.responseListener);
        this.addListener('not found', this.itemNotFoundListener);     
    }

    async handleRequestMethod(){
        try{
            const response = await this.apiInstance[this.endpointName]();
            
            if(response.status === 404){
                this.emit('not found')
                throw response.data
            }
            else {
                this.responseEmitter(response)
                //return response;
            }
        }
        catch(error){
            //console.log('tmdb error', error.response)
            if(this.errorHandlerName){
                if(error.response){
                    this.apiInstance[this.errorHandlerName](error.response.data);
                }    
            }
            else{
                console.error(new AxiosError("custom axios error:"+ error.message));
            }
            
        }
        
    }

    responseEmitter(response){
        const parsedResponse = this.apiInstance[this.responseParserName](response);
        if(parsedResponse.length === 0){
            return;
        }
        else {
            this.emit('data', parsedResponse);
        }
    }
}
