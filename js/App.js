const _CONF = {
	perPage: {
		home: 20,
		search: 20,
		genres: 20
	}
};

class App {
	constructor() {
		this.router = new Router(".page-container", "home", "not-found");
		this.auth = new Auth("#login .login-form form");
		this.postRender = new PostRender();
		this.renderer = new Renderer(this.postRender);

		initRoutesEvents(this);
		this.router.urlMonitor();

		this.initDisplayingAuthBtns();
		this.initPreloadSpinner();
		this.initBaseEvents();
		this.initGenres();
	}

	initPreloadSpinner() {
		document.querySelectorAll(".preload-spinner").forEach(item => {
			item.innerHTML = this.renderer.renderPreloadSpinner();
		});
	}

	initBaseEvents() {
		document.querySelector(".logout-btn").addEventListener("click", e => {
			this.auth.logout();
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

		const lmap = { home: homePageUpToLoad, search: searchPageUpToLoad, genres: genresPageUpToLoad };
		for(let p in lmap) {
			document.querySelector(`#${p} .more-btn`).addEventListener("click", e => {
				const from = document.querySelectorAll(`#${p} .render-container .item-card`).length;
				document.querySelector(`#${p} .more-btn-wrap .preload-spinner`).classList.remove("dnone");
				document.querySelector(`#${p} .more-btn`).classList.add("dnone");

				lmap[p](this, from, (renderContainer, resp) => {
					document.querySelector(`#${p} .more-btn-wrap .preload-spinner`).classList.add("dnone");
					if(resp.length) {
						document.querySelector(`#${p} .more-btn`).classList.remove("dnone");
					}
				});
			});
		}
	}

	initGenres() {
		getGenres(items => {
			document.querySelector("#genres .render-genres").appendChild(this.renderer.renderGenresList(items).node);
		});
	}

	initDisplayingAuthBtns() {
		if(getSessionId()) {
			document.querySelector(".logout-btn").classList.remove("dnone");
			document.querySelector(".go-login-page-btn").classList.add("dnone");
		} else {
			document.querySelector(".logout-btn").classList.add("dnone");
			document.querySelector(".go-login-page-btn").classList.remove("dnone");
		}
	}
}

document.addEventListener("DOMContentLoaded", e => {
	const app = new App();
	window.app = () => app;
});