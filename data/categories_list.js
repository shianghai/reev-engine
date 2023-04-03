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
                              
            },

        ]
    }
]

export default CategoryList