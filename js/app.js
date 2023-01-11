const app = function() {
	this.router = new Router(".page-container", "home", "not-found");
	
	(() => {
		this.router.addEvent("login", (router) => {
			document.querySelector("#single .render-container").innerHTML = "";

			if(getSessionId()) {
				document.location.hash = "page-" + router.notFoundPageId;
			}
		});

		this.router.addEvent("home", (router) => {
			document.querySelector("#single .render-container").innerHTML = "";
			
			document.querySelector("#home .preload-spinner").classList.remove("dnone");
			const xhr = new XMLHttpRequest();
			xhr.open("GET", "http://api.anilibria.tv/api/v2/getUpdates?limit=20");
			xhr.onload = () => {
				const renderContainer = document.querySelector("#home .render-container");
				if(xhr.status == 200) {
					document.querySelector("#home .preload-spinner").classList.add("dnone");
					const resp = JSON.parse(xhr.response);
					for(let i = 0; i < resp.length; i++) {
						renderContainer.appendChild(this.renderer.renderItemCard(resp[i]).node);
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

		this.router.addEvent("single", (router) => {			
			document.querySelector("#single .preload-spinner").classList.remove("dnone");
			const xhr = new XMLHttpRequest();
			const id = document.location.hash.split("id")[1];
			console.log("single item", id);

			xhr.open("GET", "http://api.anilibria.tv/api/v2/getTitle?id="+id);
			xhr.onload = () => {
				const renderContainer = document.querySelector("#single .render-container");
				if(xhr.status == 200) {
					document.querySelector("#single .preload-spinner").classList.add("dnone");
					const resp = JSON.parse(xhr.response);
					renderContainer.appendChild(this.renderer.renderSingle(resp).node);
				} else {
					const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
				}
			}

			xhr.onerror = () => {
				const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
			}
			xhr.send();
		});

		this.router.addEvent("favourites", (router) => {
			document.querySelector("#single .render-container").innerHTML = "";
			
			document.querySelector("#favourites .preload-spinner").classList.remove("dnone");
			const sessId = getSessionId();
			if(!sessId) {
				return document.location.hash = "#page-login";
			}

			const xhr = new XMLHttpRequest();
			xhr.open("GET", "http://api.anilibria.tv/api/v2/getFavorites?session="+sessId+"&limit=100");
			xhr.onload = () => {
				const renderContainer = document.querySelector("#favourites .render-container");
				if(xhr.status == 200) {
					document.querySelector("#favourites .preload-spinner").classList.add("dnone");
					const resp = JSON.parse(xhr.response);
					for(let i = resp.length-1; i >= 0 ; i--) {
						renderContainer.appendChild(this.renderer.renderItemCard(resp[i]).node);
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
	})();

	this.router.urlMonitor();
	this.auth = new Auth("#login .login-form form");
	this.renderer = new Renderer();

	if(getSessionId()) {
		document.querySelector(".logout-btn").classList.remove("dnone");
		document.querySelector(".go-login-page-btn").classList.add("dnone");
	} else {
		document.querySelector(".logout-btn").classList.add("dnone");
		document.querySelector(".go-login-page-btn").classList.remove("dnone");
	}

	document.querySelector(".logout-btn").addEventListener("click", e => {
		this.auth.logout();
	});

	document.querySelector(".btn-nav-on-mob-show").addEventListener("click", e => {
		if(e.currentTarget.classList.contains("active")) {
			e.currentTarget.classList.remove("active");
			document.querySelectorAll(".navigation-main-wrapper, .userbar-wrapper").forEach(item => {
				item.classList.remove("show");
			});
		}else{
			e.currentTarget.classList.add("active");
			document.querySelectorAll(".navigation-main-wrapper, .userbar-wrapper").forEach(item => {
				item.classList.add("show");
			});
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

document.addEventListener("DOMContentLoaded", e => {
	app();
});