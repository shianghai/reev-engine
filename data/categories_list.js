const CategoryList = [
    {
        name: 'movies',
        apiList: [
            {
                name: 'Tmdb',
                apiKey: 'bf033f5de51a929c626fe72f84ffb84d',
                baseUrl: 'https://api.themoviedb.org/3',
                modulePath: '../wrappers/movies/tmdb.js',
                endPointNames: ['searchMovie', 'searchTvShow', 'searchPeople',],
                errorHandlerName: 'handleTmdbError',
                responseParserName: 'parseTmdbResponse',
            },

        ]
    }
]

export default CategoryList