import { Schema } from "mongoose";


export const MovieSchema = new Schema({
    poster_path: String,
    adult: Boolean,
    overview: String,
    release_date: String,
    original_title: String,
    genre_ids: Array,
    id: Array,
    media_type: String,
    original_language: String,
    title: String,
    backdrop_path: String || null,
    popularity: Number,
    vote_count: Number,
    video: Boolean,
    vote_average: Number,   
});