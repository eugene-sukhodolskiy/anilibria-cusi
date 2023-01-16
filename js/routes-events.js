const initRoutesEvents = (app) => {
	app.router.addEvent("jumpTo", (router, pageId) => {
		document.querySelectorAll("#single .render-container").forEach(i => { i.innerHTML = ""; });
		document.querySelector(`#${pageId} .preload-spinner`)?.classList.remove("dnone");
		document.querySelector(`[name="search"]`).value = "";
		document.querySelectorAll(".page .more-btn").forEach(i => i.classList.add("dnone"));
		hideMobNav();

		const pageTitle = document.querySelector(`#${pageId}`)?.getAttribute("data-title");
		setPageTitle(pageTitle);
	});

	app.router.addEvent("login", (router) => {
		if(getSessionId()) {
			document.location.hash = "page:" + router.notFoundPageId;
		}
	});

	app.router.addEvent("home", (router) => {
		app.loader.homePageUpToLoad(0, (resp) => {
			const renderContainer = document.querySelector("#home .render-container");
			renderContainer.innerHTML = "";
			document.querySelector("#home .preload-spinner").classList.add("dnone");
			resp.list.length && document.querySelector("#home .more-btn").classList.remove("dnone");
			insertListToRenderContainer(renderContainer, resp.list);
		});
	});

	app.router.addEvent("single", (router) => {			
		const id = document.location.hash.split("id")[1];

		anilibriaRequest(
			"title", 
			{
				id: id
			}, 
			resp => {
				setPageTitle(resp.names.ru);
				const genres = resp.genres.join(",");
				const renderContainer = document.querySelector("#single .render-container.main-render");
				renderContainer.innerHTML = "";
				document.querySelector("#single .preload-spinner").classList.add("dnone");
				renderContainer.appendChild(app.renderer.renderSingle(resp).node);

				let squery = resp.names.ru;
				const filters = getItemCardFields().join(",");

				anilibriaRequest(
					"title/search", 
					{
						search: resp.names.ru,
						after: 0,
						limit: _CONF.numbOfRelevant,
						filter: getItemCardFields(),
					},
					resp => {
						resp.list.splice(_CONF.numbOfRelevant, resp.list.length);
						const ids = resp.list.map(i => i.id);
						const renderContainer = document.querySelector("#single .render-container.relevant-items-render");
						renderContainer.innerHTML = "";
						insertListToRenderContainer(renderContainer, resp.list.filter(i => i.id != id));

						if(_CONF.numbOfRelevant - renderContainer.childNodes.length > 0) {
							anilibriaRequest(
								"title/search", 
								{
									search: "",
									genres: genres,
									after: 0,
									limit: _CONF.numbOfRelevant + 1,
									filter: getItemCardFields(),
								}, 
								resp2 => {
									resp2.list = resp2.list.filter(i => i.id != id);
									for(let i = 0; i < resp2.list.length; i++) {
										if(renderContainer.childNodes.length >= _CONF.numbOfRelevant) {
											return false;
										}

										if(ids.indexOf(resp2.list[i].id) > -1) {
											continue;
										}
										renderContainer.appendChild(app.renderer.renderItemCard(resp2.list[i]).node);
									}
								}
							);
						}
					}
				);
			}
		);
	});

	app.router.addEvent("favourites", router => {
		app.loader.favouritesList(resp => {
			const renderContainer = document.querySelector("#favourites .render-container");
			document.querySelector("#favourites .preload-spinner").classList.add("dnone");
			renderContainer.innerHTML = "";
			for(let i = resp.length-1; i >= 0 ; i--) {
				resp[i].player.episodes = resp[i].player.series;
				renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
			}
		});
	});

	app.router.addEvent("search", router => {
		let squery = decodeURI(document.location.hash.split("sq:")[1]);
		document.querySelector(`[name="search"]`).value = squery;

		app.loader.searchPageUpToLoad(0, resp => {
			const renderContainer = document.querySelector("#search .render-container");
			renderContainer.innerHTML = "";
			document.querySelector("#search .preload-spinner").classList.add("dnone");
			resp.list.length && document.querySelector("#search .more-btn").classList.remove("dnone");
			insertListToRenderContainer(renderContainer, resp.list);
		});
	});

	app.router.addEvent("new-series", router => {
		anilibriaRequest(
			"title/updates", 
			{
				after: 0,
				limit: 60,
				filter: getItemCardFields(),
			},
			resp => {
				const renderContainer = document.querySelector("#new-series .render-container");
				renderContainer.innerHTML = "";
				document.querySelector("#new-series .preload-spinner").classList.add("dnone");

				app.loader.favouritesList(favs => {
					for(let i = 0; i < resp.list.length; i++) {
						for(let j = 0; j < favs.length; j++) {
							if(favs[j].id == resp.list[i].id) {
								renderContainer.appendChild(app.renderer.renderItemCard(resp.list[i]).node);
								break;
							}
						}
					}
				});
			}
		);
	});

	app.router.addEvent("genres", router => {
		let selectedGenres = document.location.hash.split("sg:")[1];
		setTimeout(() => {
			makeSelectedGenresActivated();
		}, 30);

		const renderContainer = document.querySelector("#genres .render-container");
		if(selectedGenres) {
			app.loader.genresPageUpToLoad(0, resp => {
				const renderContainer = document.querySelector("#genres .render-container");
				renderContainer.innerHTML = "";
				document.querySelector("#genres .preload-spinner").classList.add("dnone");
				resp.list.length && document.querySelector("#genres .more-btn").classList.remove("dnone");
				insertListToRenderContainer(renderContainer, resp.list);
			});
		} else {
			renderContainer.innerHTML = "";
			document.querySelector("#genres .preload-spinner").classList.add("dnone");
		}
	});
}