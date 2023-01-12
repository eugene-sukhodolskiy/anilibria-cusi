const initRoutesEvents = (app) => {
	app.router.addEvent("login", (router) => {
		document.querySelector("#single .render-container").innerHTML = "";

		if(getSessionId()) {
			document.location.hash = "page-" + router.notFoundPageId;
		}
	});

	app.router.addEvent("home", (router) => {
		document.querySelector("#single .render-container").innerHTML = "";
		
		document.querySelector("#home .preload-spinner").classList.remove("dnone");
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "//api.anilibria.tv/api/v2/getUpdates?limit=40");
		xhr.onload = () => {
			const renderContainer = document.querySelector("#home .render-container");
			if(xhr.status == 200) {
				renderContainer.innerHTML = "";
				document.querySelector("#home .preload-spinner").classList.add("dnone");
				const resp = JSON.parse(xhr.response);
				for(let i = 0; i < resp.length; i++) {
					renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
				}
			} else {
				const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
			}
		}

		xhr.onerror = () => {
			const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
		}
		xhr.send();
	});

	app.router.addEvent("single", (router) => {			
		document.querySelector("#single .preload-spinner").classList.remove("dnone");
		const xhr = new XMLHttpRequest();
		const id = document.location.hash.split("id")[1];
		console.log("single item", id);

		xhr.open("GET", "//api.anilibria.tv/api/v2/getTitle?id="+id);
		xhr.onload = () => {
			const renderContainer = document.querySelector("#single .render-container");
			renderContainer.innerHTML = "";
			if(xhr.status == 200) {
				document.querySelector("#single .preload-spinner").classList.add("dnone");
				const resp = JSON.parse(xhr.response);
				renderContainer.appendChild(app.renderer.renderSingle(resp).node);
			} else {
				const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
			}
		}

		xhr.onerror = () => {
			const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
		}
		xhr.send();
	});

	app.router.addEvent("favourites", (router) => {
		document.querySelector("#single .render-container").innerHTML = "";
		
		document.querySelector("#favourites .preload-spinner").classList.remove("dnone");
		const sessId = getSessionId();
		if(!sessId) {
			return document.location.hash = "#page-login";
		}

		const xhr = new XMLHttpRequest();
		xhr.open("GET", "//api.anilibria.tv/api/v2/getFavorites?session="+sessId+"&limit=100");
		xhr.onload = () => {
			const renderContainer = document.querySelector("#favourites .render-container");
			if(xhr.status == 200) {
				document.querySelector("#favourites .preload-spinner").classList.add("dnone");
				renderContainer.innerHTML = "";
				const resp = JSON.parse(xhr.response);
				for(let i = resp.length-1; i >= 0 ; i--) {
					renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
				}
			} else {
				const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
			}
		}

		xhr.onerror = () => {
			const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
		}
		xhr.send();
	});

	app.router.addEvent("search", (router) => {
		document.querySelector("#single .render-container").innerHTML = "";
		
		document.querySelector("#search .preload-spinner").classList.remove("dnone");
		let squery = document.location.hash.split("sq:")[1];
		document.querySelector(`[name="search"]`).value = decodeURI(squery);
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "//api.anilibria.tv/api/v2/searchTitles?search="+squery+"&limit=20");
		xhr.onload = () => {
			const renderContainer = document.querySelector("#search .render-container");
			if(xhr.status == 200) {
				renderContainer.innerHTML = "";
				document.querySelector("#search .preload-spinner").classList.add("dnone");
				const resp = JSON.parse(xhr.response);
				for(let i = 0; i < resp.length; i++) {
					renderContainer.appendChild(app.renderer.renderItemCard(resp[i]).node);
				}
			} else {
				const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
			}
		}

		xhr.onerror = () => {
			const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
		}
		xhr.send();
	});
}