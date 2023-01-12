const initRoutesEvents = (app) => {
	app.router.addEvent("login", (router) => {
		document.querySelector("#single .render-container").innerHTML = "";

		if(getSessionId()) {
			document.location.hash = "page:" + router.notFoundPageId;
		}
	});

	app.router.addEvent("home", (router) => {
		document.querySelector("#single .render-container").innerHTML = "";
		document.querySelector("#home .preload-spinner").classList.remove("dnone");

		stdXHR(
			"GET", 
			"//api.anilibria.tv/api/v2/getUpdates?limit=40",
			xhr => {
				const resp = JSON.parse(xhr.response);
				const renderContainer = document.querySelector("#home .render-container");
				renderContainer.innerHTML = "";
				document.querySelector("#home .preload-spinner").classList.add("dnone");
				for(let i = 0; i < resp.length; i++) {
					renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
				}
			}
		).send();
	});

	app.router.addEvent("single", (router) => {			
		document.querySelector("#single .preload-spinner").classList.remove("dnone");
		const id = document.location.hash.split("id")[1];

		stdXHR(
			"GET", 
			"//api.anilibria.tv/api/v2/getTitle?id="+id,
			xhr => {
				const resp = JSON.parse(xhr.response);
				const renderContainer = document.querySelector("#single .render-container");
				renderContainer.innerHTML = "";
				document.querySelector("#single .preload-spinner").classList.add("dnone");
				renderContainer.appendChild(app.renderer.renderSingle(resp).node);
			}
		).send();
	});

	app.router.addEvent("favourites", (router) => {
		document.querySelector("#single .render-container").innerHTML = "";
		document.querySelector("#favourites .preload-spinner").classList.remove("dnone");
		getFavouritesList(resp => {
			const renderContainer = document.querySelector("#favourites .render-container");
			document.querySelector("#favourites .preload-spinner").classList.add("dnone");
			renderContainer.innerHTML = "";
			for(let i = resp.length-1; i >= 0 ; i--) {
				renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
			}
		});
	});

	app.router.addEvent("search", (router) => {
		document.querySelector("#single .render-container").innerHTML = "";
		document.querySelector("#search .preload-spinner").classList.remove("dnone");
		let squery = document.location.hash.split("sq:")[1];
		document.querySelector(`[name="search"]`).value = decodeURI(squery);

		stdXHR(
			"GET", 
			"//api.anilibria.tv/api/v2/searchTitles?search="+squery+"&limit=20",
			xhr => {
				const resp = JSON.parse(xhr.response);
				const renderContainer = document.querySelector("#search .render-container");
				renderContainer.innerHTML = "";
				document.querySelector("#search .preload-spinner").classList.add("dnone");
				for(let i = 0; i < resp.length; i++) {
					renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
				}
			}
		).send();
	});
}