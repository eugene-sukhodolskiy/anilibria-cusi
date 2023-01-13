const initRoutesEvents = (app) => {
	app.router.addEvent("jumpTo", (router, pageId) => {
		document.querySelectorAll("#single .render-container").forEach(i => { i.innerHTML = ""; });
		document.querySelector(`#${pageId} .preload-spinner`)?.classList.remove("dnone");
		document.querySelector(`[name="search"]`).value = "";
		document.querySelectorAll(".page .more-btn").forEach(i => i.classList.add("dnone"));
		hideMobNav();
	});

	app.router.addEvent("login", (router) => {
		if(getSessionId()) {
			document.location.hash = "page:" + router.notFoundPageId;
		}
	});

	app.router.addEvent("home", (router) => {
		homePageUpToLoad(app, 0, (renderContainer, resp) => {
			renderContainer.innerHTML = "";
			document.querySelector("#home .preload-spinner").classList.add("dnone");
			resp.length && document.querySelector("#home .more-btn").classList.remove("dnone");
		});
	});

	app.router.addEvent("single", (router) => {			
		const id = document.location.hash.split("id")[1];

		stdXHR(
			"GET", 
			"//api.anilibria.tv/api/v2/getTitle?id="+id,
			xhr => {
				const resp = JSON.parse(xhr.response);
				const genres = resp.genres.join(",");
				const renderContainer = document.querySelector("#single .render-container.main-render");
				renderContainer.innerHTML = "";
				document.querySelector("#single .preload-spinner").classList.add("dnone");
				renderContainer.appendChild(app.renderer.renderSingle(resp).node);

				let squery = resp.names.ru;
				const filters = getItemCardFields().join(",");
				stdXHR(
					"GET", 
					"//api.anilibria.tv/api/v2/searchTitles?search="+squery+"&limit=12&filter="+filters,
					xhr => {
						const resp = JSON.parse(xhr.response);
						const ids = resp.map(i => i.id);
						const renderContainer = document.querySelector("#single .render-container.relevant-items-render");
						renderContainer.innerHTML = "";
						for(let i = 0; i < resp.length; i++) {
							if(resp[i].id == id) {
								continue;
							}

							renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
						}

						const freePlaces = 12 - renderContainer.querySelectorAll(".item-card").length;
						if(freePlaces > 0) {
							const limit = 12 * 2;
							stdXHR(
								"GET", 
								`//api.anilibria.tv/api/v2/searchTitles?search=&genres=${genres}&limit=${limit}&filter=${filters}`,
								xhr => {
									const resp2 = JSON.parse(xhr.response);
									for(let i = 0; i < resp2.length; i++) {
										if(renderContainer.querySelectorAll(".item-card").length >= 12) {
											return false;
										}

										if(ids.indexOf(resp2[i].id) > -1) {
											continue;
										}
										renderContainer.appendChild(app.renderer.renderItemCard(resp2[i]).node);
									}
								}
							).send();
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

		searchPageUpToLoad(app, 0, (renderContainer, resp) => {
			renderContainer.innerHTML = "";
			document.querySelector("#search .preload-spinner").classList.add("dnone");
			resp.length && document.querySelector("#search .more-btn").classList.remove("dnone");
		});
	});

	app.router.addEvent("new-series", (router) => {
		const filters = getItemCardFields().join(",");

		stdXHR(
			"GET", 
			"//api.anilibria.tv/api/v2/getUpdates?limit=60&filter="+filters,
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

	app.router.addEvent("genres", router => {
		let selectedGenres = document.location.hash.split("sg:")[1];
		setTimeout(() => {
			makeSelectedGenresActivated();
		}, 30);

		const renderContainer = document.querySelector("#genres .render-container");
		const filters = getItemCardFields().join(",");
		if(selectedGenres) {
			genresPageUpToLoad(app, 0, (renderContainer, resp) => {
				renderContainer.innerHTML = "";
				document.querySelector("#genres .preload-spinner").classList.add("dnone");
				resp.length && document.querySelector("#genres .more-btn").classList.remove("dnone");
			});
		} else {
			renderContainer.innerHTML = "";
			document.querySelector("#genres .preload-spinner").classList.add("dnone");
		}
	});
}