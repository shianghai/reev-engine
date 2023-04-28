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
    
  
    async getCache(endPointId){
        try {
          const cache = await this.phraseCacheModel
            .findOne({ endPointId: endPointId })
            .maxTimeMS(30000) // set maxTimeMS to 30 seconds //TODO: optimize this later
            .exec();
            return cache;
        } catch (error) {
          throw error;
        }
      } 
      

    /**
     * @method setCache saves the current state of an endpoint with respect to the search phrase
     * @param {int} pageNumber  the latest page that has been processed by the endpoint with regards to the searchPhrase
     */
    async saveCache(cache){
        console.log(cache)
        try{
            const savedCache = await this.phraseCacheModel.findOneAndUpdate({endPointId: cache.endPointId}, cache, {
                upsert: true,
            })
            .maxTimeMS(30000)
            .exec()
            
            return savedCache;
        }
        catch(error){
            throw error;
        }

       
    }
}