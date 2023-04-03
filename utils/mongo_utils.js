async function saveResponse(data, model, _idProps, dbItemProps, cacheInstance, ){
    if(Array.isArray(data.results)){
      for(const value of data){
        const id = constructId({...value, ...dbItemProps}, _idProps)
        const newModel = new model({
            id: id,
            searchPhrase: cacheInstance.searchPhrase,
          ...dbItemProps, 
          thirdPartyInfo: {...value}
        });
        newModel.save()
          .then(async(savedReev) => {
            console.log('Reev saved:', savedReev);
            //set cache of the saved reev or query
            try{
              const cache = await phraseCache.getCache();
              if(cache != null){
                const cachedEndpoint = cache.cachedEndpoints.get(endPointName);
                if(cachedEndpoint){
                  
                    cache.cachedEndpoints.set(savedReev.sourceName, {
                            endPointName: savedReev.sourceName,
                            lastPageQueried: data.page,
                            lastQueryDate: new Date()
                        });
                }
              }
              await cacheInstance.saveCache(newCache)
              console.log('cache saved Successfully')
            }
            catch(error){
                if(error.message === 'Cache Not Found'){
                    //save a new cache
                    console.log(error.message)
                }
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }

 export async function getPhraseCache(cacheInstance, endPointName){
    let cachedPhrase = null
    const cache = await cacheInstance.getCache();
      if(cache){
        const cachedEndpoint = cache.cachedEndpoints.get(endPointName);
        if(cachedEndpoint){
          //check if endpoint exists in the cached endpoints
          cachedPhrase = cache;         
        }
        else {
          try{
            const updatedCache = cache.cachedEndpoints.set(endPointName, {
              lastPageQueried: 1,
              endPointName: endPointName,
              lastQueryDate: Date.now(),
              apiName: apiName
            });
         
            //update existing cache with the endpoint details
            const savedCache = await cacheInstance.saveCache(updatedCache);
            cachedPhrase = savedCache
          }
          catch(error){
            console.log(error)
          }
        }
              
      }
      else {
        //create a new cache
        try{
          const newCache =  {
            id: query,
            cachedEndpoints: new Map([
                [endPointName, {
                    endPointName: endPointName,
                    apiName,
                    lastPageQueried: 1,
                    lastQueryDate: new Date()
                }]
            ])
          };
          
          const cache = await cacheInstance.saveCache(newCache);
          
          cachedPhrase = cache;
                           
        }
        catch(error){
          console.log('cache error', error);
        }
      }
      return cachedPhrase;
     
  }

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