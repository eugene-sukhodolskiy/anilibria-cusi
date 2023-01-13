const homePageUpToLoad = (app, from, callback) => {
	const filters = getItemCardFields().join(",");
	stdXHR(
		"GET", 
		`//api.anilibria.tv/api/v2/getUpdates?after=${from}&limit=${_CONF.perPage.home}&filter=${filters}`,
		xhr => {
			const resp = JSON.parse(xhr.response);
			const renderContainer = document.querySelector("#home .render-container");
			callback(renderContainer, resp);
			for(let i = 0; i < resp.length; i++) {
				renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
			}
		}
	).send();
}

const searchPageUpToLoad = (app, from, callback) => {
	let squery = document.location.hash.split("sq:")[1];
	const filters = getItemCardFields().join(",");
	stdXHR(
		"GET", 
		`//api.anilibria.tv/api/v2/searchTitles?search=${squery}&limit=${_CONF.perPage.search}&after=${from}&filter=${filters}`,
		xhr => {
			const resp = JSON.parse(xhr.response);
			const renderContainer = document.querySelector("#search .render-container");
			callback(renderContainer, resp);
			for(let i = 0; i < resp.length; i++) {
				renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
			}
		}
	).send();
}

const genresPageUpToLoad = (app, from, callback) => {
	const filters = getItemCardFields().join(",");
	let selectedGenres = document.location.hash.split("sg:")[1];
	stdXHR(
		"GET", 
		`//api.anilibria.tv/api/v2/searchTitles?search=&genres=${selectedGenres}&limit=${_CONF.perPage.genres}&filter=${filters}&after=${from}`,
		xhr => {
			const resp = JSON.parse(xhr.response);
			const renderContainer = document.querySelector("#genres .render-container");
			callback(renderContainer, resp);
			for(let i = 0; i < resp.length; i++) {
				renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
			}
		}
	).send();
}