class Loader {
	constructor() {}

	homePageUpToLoad(from, callback) {
		anilibriaRequest(
			"title/updates", 
			{
				after: from,
				limit: _CONF.perPage.home,
				filter: getItemCardFields()
			}, 
			resp => callback(resp)
		);
	}

	searchPageUpToLoad(from, callback) {
		let squery = decodeURI(document.location.hash.split("sq:")[1]);

		anilibriaRequest(
			"title/search", 
			{
				after: from,
				limit: _CONF.perPage.search,
				filter: getItemCardFields(),
				search: squery
			}, 
			resp => callback(resp)
		);
	}

	genresPageUpToLoad(from, callback) {
		const selectedGenres = getSelectedGenres();

		anilibriaRequest(
			"title/search", 
			{
				search: "",
				filter: getItemCardFields(),
				genres: selectedGenres.join(","),
				after: from,
				limit: _CONF.perPage.search,
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
}