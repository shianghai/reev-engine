import mongoose from "mongoose";
import 'dotenv/config';
import PhraseCacheSchema from "../schemas/phrase_cache_schema.js";

export default class PhraseCache{
    constructor(searchPhrase, endpointName){
        this.searchPhrase = searchPhrase;
        this.endpointName = endpointName;
        

        const cacheConnection = mongoose.createConnection(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true 
         });
        this.phraseCacheModel = cacheConnection.model('searchPhraseCache', PhraseCacheSchema);
    }
    
  
    async getCache(){
        try{
            const cache = await this.phraseCacheModel.findOne({id: this.searchPhrase}).exec()
            if(cache) return cache            
            else return null;
        }
        catch(error){
            throw error;
        };
        
        
    }

    /**
     * @method setCache saves the current state of an endpoint with respect to the search phrase
     * @param {int} pageNumber  the latest page that has been processed by the endpoint with regards to the searchPhrase
     */
    async saveCache(cache){
        try{
            const savedCache = await this.phraseCacheModel.findOneAndUpdate({id: cache.id}, cache, {
                upsert: true,
            });
            
            return savedCache;
        }
        catch(error){
            throw error;
        }

       
    }
}