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

const getFavouritesList = callback => {
	const sessId = getSessionId();
	if(!sessId) {
		return setTimeout(() => document.location.hash = "#page:login", 20);
	}

	const filters = getItemCardFields().join(",");
	stdXHR(
		"GET", 
		"//api.anilibria.tv/api/v2/getFavorites?session="+sessId+"&limit=100&filter="+filters,
		xhr => {
			const resp = JSON.parse(xhr.response);
			callback(resp);
		}
	).send();
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

const getGenres = (callback) => {
	stdXHR(
		"GET", 
		"//api.anilibria.tv/api/v2/getGenres?sorting_type=1",
		xhr => {
			const resp = JSON.parse(xhr.response);
			callback(resp);
		}
	).send();
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