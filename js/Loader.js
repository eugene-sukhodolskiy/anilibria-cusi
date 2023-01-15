class Loader {
	constructor(){}

	homePageUpToLoad(from, callback) {
		anilibriaRequest(
			"getUpdates", 
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
			"searchTitles", 
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
			"searchTitles", 
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

		anilibriaRequest(
			"getFavorites", 
			{
				session: sessId,
				limit: 100,
				filter: getItemCardFields(),
			}, 
			resp => callback(resp)
		);
	}

	genresList(callback) {
		anilibriaRequest(
			"getGenres", 
			{
				sorting_type: 1
			}, 
			resp => callback(resp)
		);
	}
}