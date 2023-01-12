const initPreloadSpinner = (app) => {
	document.querySelectorAll(".preload-spinner").forEach(item => {
		item.innerHTML = app.renderer.renderPreloadSpinner();
	});
}

const initBaseEvents = app => {
	document.querySelector(".logout-btn").addEventListener("click", e => {
		app.auth.logout();
	});

	document.querySelector(".btn-nav-on-mob-show").addEventListener("click", e => {
		if(e.currentTarget.classList.contains("active")) {
			hideMobNav();
		}else{
			showMobNav();
		}
	});

	document.querySelector(`[name="search"]`).addEventListener("keyup", e => {
		e.preventDefault();
		if(e.keyCode == 13) {
			let squery = e.currentTarget.value.trim();
			document.location.hash = `page:search;sq:${squery}`;
			e.currentTarget.blur();
		}
	});
}

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
			const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
		}
	}

	xhr.onerror = () => {
		const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
	}

	return xhr;
}

const getFavouritesList = callback => {
	const sessId = getSessionId();
	if(!sessId) {
		return document.location.hash = "#page:login";
	}

	stdXHR(
		"GET", 
		"//api.anilibria.tv/api/v2/getFavorites?session="+sessId+"&limit=100",
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