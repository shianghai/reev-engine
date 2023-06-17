/**
 * The configuration object for each API Integration.
 *
 * @typedef {Object} apiConfig
 * @property {string} name - The name of the Api
 * @property {string} apiKey - The API key for accessing API.
 * @property {string} baseUrl - The base URL for API.
 * @property {string[]} _idProps - An array of property names used as identifiers for data objects (e.g., movies, TV shows).
 * @property {string} modulePath - The path to the module file that wraps the API.
 * @property {string[]} endPointNames - An array of names for different endpoints available in the API.
 * @property {string} errorHandlerName - The name of the function used to handle the API errors.
 * @property {string} responseParserName - The name of the function used to parse the API responses.
 * @property {string} totalPagesGetterName - The name of the function used to get the total number of pages in a response from the API.
 * @property {string} currentPageGetterName - The name of the function used to get the current page number in a response from the API.
 * @property {Object[]} schemaMapper - An array of objects mapping API response properties to desired property names in the application schema.
 */

/** 
*@typedef {Object} Category The category object containing the name of the category and the list of APIs in that category
*@property {string} name - The name of the category
*@property {apiConfig[]} apiList - The list of APIs in the category
*/

/**
 * @typedef {Object[]} schemaMapper - An array of objects mapping API response properties to desired property names in the application schema.
 * @property {string} poster_url - The URL of the poster image for the movie or TV show.
 * @property {string} adult - Whether the movie or TV show is for adults only.
 * @property {string} overview - The overview of the movie or TV show.
 * @property {string} release_date - The release date of the movie or TV show.
 * @property {string} genres - The genres of the movie or TV show.
 * @property {string} id - The ID of the movie or TV show.
 * @property {string} media_type - The media type of the movie or TV show.
 * @property {string} title - The title of the movie or TV show.
 * @property {string} rating_count - The rating count of the movie or TV show.
 * @property {string} rating - The rating of the movie or TV show.
 * @property {string} source - The source of the movie or TV show.
 * @property {string} category - The category of the movie or TV show.
 * @property {string} video - Whether the movie or TV show has a video.
 * @property {string} language - The language of the movie or TV show.
 * @property {string} popularity - The popularity of the movie or TV show.
 * @property {string} backdrop_url - The URL of the backdrop image for the movie or TV show.
 * @property {string} runtime - The runtime of the movie or TV show.
 * @property {string} status - The status of the movie or TV show.
 */

/** 
 *@typedef {Category[]} APICategories A list of categories and their corresponding APIs 
*/

const APICategories = [
    // {
    //     name: 'movies',
    //     apiList: [
    //         {
    
    //             name: 'Tmdb',
    //             apiKey: "bf033f5de51a929c626fe72f84ffb84d",
    //             baseUrl: 'https://api.themoviedb.org/3',
    //             _idProps: ['title', 'id', 'category', 'source'],
    //             modulePath: '../wrappers/movies/tmdb/tmdb.js',
    //             endPointNames: ['searchMovie', 'searchTvShow', 'searchPeople',],
    //             errorHandlerName: 'handleTmdbError',
    //             responseParserName: 'parseTmdbResponse',
    //             totalPagesGetterName: 'getTotalPagesNumber',
    //             currentPageGetterName: 'getCurrentPageNumber',
    //             schemaMapper: [{image_url: 'poster_path'}, {is_adult: 'adult'},{description: 'overview'},{release_date: 'release_date'},{genres: 'genre_ids'},{id: 'id'},
    //                 {media_type: 'media_type'},{title: 'title'},{rating_count: 'vote_count'},{has_video: 'video'},{language: 'original_language'},{ rating: 'vote_average'},]
                              
    //         },
    //     ]
    // },
    {
        name: 'Google',
        apiList: [
            {    
                          
                name: 'Google Search',
                apiKey: "AIzaSyA5Tfxl_yQcrbpjmq95NskuKFGDAjTB5Qg",
                baseUrl: 'https://customsearch.googleapis.com/',
                modulePath: '../wrappers/google/google.js',
                _idProps: ['title', 'url', 'source'],
                endPointNames: ['searchGoogle'],
                errorHandlerName: 'handleGoogleError',
                responseParserName: 'parseGoogleResponse',
                totalPagesGetterName: 'getTotalPages',
                nextPageGetterName: 'getNextPage',
                currentPageGetterName: 'getCurrentPage',       
                schemaMapper: [{ image_url: ['pagemap', 'cse_image', 'src'] }, { description: 'snippet' }, 
                    { title: 'title' }, { has_video: 'video' }, { thumbnail_url: ['pagemap', 'cse_thumbnail', 'src'] }, { video_url: ['videoobject', 'url']}, {'display_url': 'displayLink'}, {'url': 'link'}]
            },
        ]
    }
]

export default APICategories;