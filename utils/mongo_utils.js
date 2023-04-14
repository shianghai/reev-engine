

/**
 * Saves an object to the to the mongodb database
 * @param {Object} data the response recieved in the response listener. contains the results array and page number 
 * @param {ReevItemSchema} model the model used for the saving of the results to the database 
 * @param {Object} _idProps the fields which will be used to construct the id of each reevItem
 * @param {Object} dbItemProps the additional properties that are added to the reev item
 * @param {Class} cacheInstance an instance of PhraseCache class. Used for saving and getting a cache for using the search phrase
 */
async function saveResponse(data, model, _idProps, dbItemProps, cacheInstance){
    if(Array.isArray(data.results)){
      for(const value of data.results){
        const id = constructId({...value, ...dbItemProps}, _idProps);
        const newReevItem = new model({
            id: id,
          ...dbItemProps, 
          itemInfo: {...value}
        });      
        try{
              const savedReevItem = await newReevItem.save();           
              console.log("savedReevItem: ", savedReevItem.searchPhrase);           
              // const cache = await cacheInstance.getCache(savedReevItem.sourceEndpoint);  
              // const updatedCache = cache.cachedPhrases.set(savedReevItem.searchPhrase, {
              //     lastPageQueried: data.page,
              //     lastQueryDate: Date.now(),
              // });
              // await cacheInstance.saveCache(updatedCache);
        }
        catch(err){
          if(err.code === 11000 ){
            //handle duplicate key error
            //filter out the duplicated item and call the saveResponse function again with the filtered data
            const newData = data.results.filter((result)=>{
              return result.id != newReevItem.itemInfo.id;
            });
            const tempData = {...data, results: newData}
            if(newData.length){
              await saveResponse(tempData, model, _idProps, dbItemProps, cacheInstance)
            }
          }
          else{
            throw err;
          }
        };
      }
    }
  }


/** 
 * 
 * @param {} cacheInstance an instance of PhraseCache class initialised with the searchPhrase and the endpointName. Used for saving and getting a cache for in the database
 * @param {String} endPointName the name of the endpoint to use for the cache fething
 * @returns {Object} retrieved cache from the database or a newly saved one if there was no previous one
 */
 export async function getPhraseCache(cacheInstance, endPointName, apiName, searchPhrase){
    let resultCache = null;
    
    try{
      const cache = await cacheInstance.getCache(endPointName);     
        if(cache != null){
          let tempCache = cache;
          const cachedPhrase = cache.cachedPhrases.get(searchPhrase);
          if(cachedPhrase){
            //check if phrase already exists in the cached endpoints
            resultCache = cache;         
          }
          else {
              const updatedCache = tempCache.cachedPhrases.set(searchPhrase, {
                lastPageQueried: 0,
                totalPages,
                lastQueryDate: Date.now(),
              });
          
              //update existing cache with the endpoint details
              const savedCache = await cacheInstance.saveCache(updatedCache);
              resultCache = savedCache
          }
                
        }
        else {
          //create a new cache
            const newCache =  {
              endPointId: endPointName,
              apiName: apiName,
              cachedPhrases: new Map([
                  [searchPhrase, {                      
                      totalPages: 0,
                      lastPageQueried: 0,
                      lastQueryDate: new Date()
                  }]
              ])
            };
            
            const cache = await cacheInstance.saveCache(newCache);
            
            resultCache = cache;         
        }
    }
    catch(error){
      throw error;
    }
    return resultCache;
     
  }

  /**
   * 
   * @param {Object} data a response object gotten from an enpoint query
   * @param {Object} _idProps contains the keys that would be used to get the required get the required fields to construct the id
   * @returns 
   */
  export function constructId(data, _idProps){
    const _id = {}
    for(const prop of _idProps){
      Object.assign(_id, {[prop]: data[prop]});
    }
  
    return JSON.stringify(_id);
  }   
  
  
  export function desctructId(id){
    return JSON.parse(id);
  }

  export default saveResponse