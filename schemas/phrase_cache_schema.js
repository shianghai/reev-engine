import { Schema } from "mongoose";

const EndpointCacheInfo = new Schema({
    lastPageQueried: {
        type: Number,
        required: true
    },
    endPointName: String,
    lastQueryDate: Date,
    totalPages: Number,
    apiName: String
})

const PhraseCacheSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    text: String,
    cachedEndpoints: {
        type: Map,
        of: EndpointCacheInfo,
    }
    
});

export default PhraseCacheSchema;