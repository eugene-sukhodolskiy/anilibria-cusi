const initRoutesEvents = (app) => {
	app.router.addEvent("jumpTo", (router, pageId) => {
		document.querySelectorAll("#single .render-container").forEach(i => { i.innerHTML = ""; });
		document.querySelector(`#${pageId} .preload-spinner`)?.classList.remove("dnone");
		document.querySelector(`[name="search"]`).value = "";
		hideMobNav();
	});

	app.router.addEvent("login", (router) => {
		if(getSessionId()) {
			document.location.hash = "page:" + router.notFoundPageId;
		}
	});

	app.router.addEvent("home", (router) => {
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
		const id = document.location.hash.split("id")[1];

		stdXHR(
			"GET", 
			"//api.anilibria.tv/api/v2/getTitle?id="+id,
			xhr => {
				const resp = JSON.parse(xhr.response);
				const renderContainer = document.querySelector("#single .render-container.main-render");
				renderContainer.innerHTML = "";
				document.querySelector("#single .preload-spinner").classList.add("dnone");
				renderContainer.appendChild(app.renderer.renderSingle(resp).node);

				let squery = resp.names.ru;
				stdXHR(
					"GET", 
					"//api.anilibria.tv/api/v2/searchTitles?search="+squery+"&limit=30",
					xhr => {
						const resp = JSON.parse(xhr.response);
						const renderContainer = document.querySelector("#single .render-container.relevant-items-render");
						renderContainer.innerHTML = "";
						for(let i = 0; i < resp.length; i++) {
							if(resp[i].id == id) {
								continue;
							}

							renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
						}
					}
				).send();
			}
		).send();
	});

	app.router.addEvent("favourites", (router) => {
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
		let squery = document.location.hash.split("sq:")[1];
		document.querySelector(`[name="search"]`).value = decodeURI(squery);

		stdXHR(
			"GET", 
			"//api.anilibria.tv/api/v2/searchTitles?search="+squery+"&limit=30",
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

	app.router.addEvent("new-series", (router) => {
		stdXHR(
			"GET", 
			"//api.anilibria.tv/api/v2/getUpdates?limit=60",
			xhr => {
				const resp = JSON.parse(xhr.response);
				const renderContainer = document.querySelector("#new-series .render-container");
				renderContainer.innerHTML = "";
				document.querySelector("#new-series .preload-spinner").classList.add("dnone");

				getFavouritesList(favs => {
					for(let i = 0; i < resp.length; i++) {
						for(let j = 0; j < favs.length; j++) {
							if(favs[j].id == resp[i].id) {
								renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
								break;
							}
						}

					}
				});
			}
		).send();
	});
}