class Loader {
	constructor() {}

	homePageUpToLoad(pageNum, callback) {
		anilibriaRequest(
			"title/updates", 
			{
				page: pageNum,
				items_per_page: _CONF.perPage.home,
				filter: getItemCardFields()
			}, 
			resp => callback(resp)
		);
	}

	searchPageUpToLoad(pageNum, callback) {
		let squery = decodeURI(document.location.hash.split("sq:")[1]);

		anilibriaRequest(
			"title/search", 
			{
				page: pageNum,
				items_per_page: _CONF.perPage.search,
				filter: getItemCardFields(),
				search: squery
			}, 
			resp => callback(resp)
		);
	}

	genresPageUpToLoad(pageNum, callback) {
		const selectedGenres = getSelectedGenres();

		anilibriaRequest(
			"title/search", 
			{
				search: "",
				filter: getItemCardFields(),
				genres: selectedGenres.join(","),
				page: pageNum,
				items_per_page: _CONF.perPage.search,
			}, 
			resp => callback(resp)
		);
	}

	favouritesList(callback) {
		const sessId = getSessionId();
		if(!sessId) {
			return setTimeout(() => document.location.hash = "#page:login", 20);
		}

		app().cacheProvider.cacheable(
			"favouritesList", 
			cacheableCallback => {
				anilibriaRequest(
					"v2.13:getFavorites", 
					{
						session: sessId,
						limit: 100,
						filter: getItemCardFields(true),
					}, 
					resp => cacheableCallback(resp)
				);
			}, 
			callback,
			60 * 5
		);
	}

	genresList(callback) {
		app().cacheProvider.cacheable(
			"genresList",
			cacheableCallback => {
				anilibriaRequest(
					"genres", 
					{
						sorting_type: 1
					}, 
					resp => cacheableCallback(resp)
				);
			},
			callback,
			60 * 60 * 3
		);
	}

	scheduleList(callback) {
		app().cacheProvider.cacheable(
			"scheduleList",
			cacheableCallback => {
				anilibriaRequest(
					"title/schedule", 
					{
						filter: getItemCardFields()
					}, 
					cacheableCallback
				);
			},
			callback,
			60 * 60 * 3
		);
	}
}