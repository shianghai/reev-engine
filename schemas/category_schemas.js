import { Schema } from "mongoose";


export const MovieSchema = new Schema({
    poster_url: String,
    adult: Boolean,
    overview: String,
    release_date: String,
    genre_ids: Array,
    id: Array,
    media_type: String,
    title: String,
    rating_count: Number,
    video: Boolean,
    language: String,
    rating: Number,   
});


