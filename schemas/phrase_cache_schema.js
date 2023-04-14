import { Schema } from "mongoose";

const CachedPhraseSchema = new Schema({
    lastPageQueried: {
        type: Number,
        required: true
    },
    totalPages: Number,
    lastQueryDate: Date,
})

const PhraseCacheSchema = new Schema({
    endPointId: {
        type: String,
        unique: true
    },
    cachedPhrases: {
        type: Map,
        of: CachedPhraseSchema,
    },
    apiName: String,
    
});

export default PhraseCacheSchema;