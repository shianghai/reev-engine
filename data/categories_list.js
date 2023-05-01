const CategoryList = [
    {
        name: 'movies',
        apiList: [
            {
                name: 'Tmdb',              
                apiKey: 'bf033f5de51a929c626fe72f84ffb84d',
                baseUrl: 'https://api.themoviedb.org/3',
                _idProps: ['title', 'id', 'category', 'source'],
                modulePath: '../wrappers/movies/tmdb/tmdb.js',
                endPointNames: ['searchMovie', 'searchTvShow', 'searchPeople',],
                errorHandlerName: 'handleTmdbError',
                responseParserName: 'parseTmdbResponse',
                totalPagesGetterName: 'getTotalPagesNumber',
                currentPageGetterName: 'getCurrentPageNumber',
                schemaMapper: [{poster_url: 'poster_path'}, {adult: 'adult'},{overview: 'overview'},{release_date: 'release_date'},{genres: 'genre_ids'},{id: 'id'},
                    {media_type: 'media_type'},{title: 'title'},{rating_count: 'vote_count'},{video: 'video'},{language: 'original_language'},{ rating: 'vote_average'},]
                              
            },
            // {
            //     name: 'Google',
            //     apiKey: 'AIzaSyA5Tfxl_yQcrbpjmq95NskuKFGDAjTB5Qg',
            //     _idProps: ['']
            // }

        ]
    }
]

export default CategoryList