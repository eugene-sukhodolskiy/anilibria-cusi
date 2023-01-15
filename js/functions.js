const getSessionId = () => {
	const sessId = localStorage.getItem("sessionId");
	if(sessId) {
		return sessId;
	}

	return false;
};

const stdXHR = (method, url, onloadCallback) => {
	const xhr = new XMLHttpRequest();
	xhr.open(method, url);
	
	xhr.onload = () => {
		if(xhr.status == 200) {
			onloadCallback(xhr);
		} else {
			if(xhr.status == 404) {
				app().router.goToPage("not-found");
			}
			const alert = createGlobalAlertComponent("danger", "Ошибка загрузки данных");
			setTimeout(() => alert.close(), 3000);
		}
	}

	xhr.onerror = () => {
		const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
		setTimeout(() => alert.close(), 3000);
	}

	return xhr;
}

const showMobNav = () => {
	document.querySelector(".btn-nav-on-mob-show").classList.add("active");
	document.querySelectorAll(".navigation-main-wrapper, .userbar-wrapper").forEach(item => {
		item.classList.add("show");
	});
}

const hideMobNav = () => {
	document.querySelector(".btn-nav-on-mob-show").classList.remove("active");
	document.querySelectorAll(".navigation-main-wrapper, .userbar-wrapper").forEach(item => {
		item.classList.remove("show");
	});
}

const makeSelectedGenresActivated = () => {
	let selectedGenres = document.location.hash.split("sg:")[1];
	selectedGenres = selectedGenres 
		? selectedGenres.split(",").map(item => { return decodeURI(item); }) 
		: [];
	document.querySelectorAll("#genres .render-genres .genre-btn.active").forEach(
		i => i.classList.remove("active")
	);
	for(let i=0; i<selectedGenres.length; i++) {
		document.querySelector(`#genres .render-genres .genre-btn[data-genre-name="${selectedGenres[i]}"]`)?.classList.add("active");
	}
}

const getItemCardFields = () => {
	return [ "id", "code", "names", "genres", "posters", "status", "player", "season", "type" ];
}

const setPageTitle = pageTitle => {
	document.querySelector("head title").innerHTML = pageTitle;
}

const nodeFromHTML = html => {
	const container = document.createElement("DIV");
	container.innerHTML = html;
	return item = container.childNodes[0];
}

const addToFavourites = (postId, callback) => {
	const sessId = getSessionId();
	if(sessId) {
		anilibriaRequest(
			"addFavorite",
			{
				session: sessId,
				title_id: postId
			},
			resp => callback(resp)
		);
	}
}

const removeFromFavourites = (postId, callback) => {
	const sessId = getSessionId();
	if(sessId) {
		anilibriaRequest(
			"delFavorite",
			{
				session: sessId,
				title_id: postId
			},
			resp => callback(resp)
		);
	}
}

const insertListToRenderContainer = (renderContainer, list) => {
	for(let i = 0; i < list.length; i++) {
		renderContainer.appendChild(app().renderer.renderItemCard(list[i]).node);
	}
}

const anilibriaRequest = (name, params, callback) => {
	const methodMap = {
		delFavorite: "DELETE",
		addFavorite: "PUT",
		_default: "GET"
	};
	params = params || {};

	const method = methodMap[name] || methodMap._default;
	let url = `//${_CONF.api.domen}/api/${_CONF.api.ver}/${name}`;
	
	if(params["filter"]) {	
	 	params.filter = params.filter.join(",");
	}

	const query = (new URLSearchParams(params)).toString();
	if(query) {
		url += `?${query}`;
	}

	stdXHR(method, url,
		xhr => {
			const resp = JSON.parse(xhr.response);
			callback(resp);
		}
	).send();
}

const getSelectedGenres = () => {
	let genres = document.location.hash.split("sg:")[1];
	genres = decodeURI(genres);
	return genres.length ? genres.split(",") : [];
}