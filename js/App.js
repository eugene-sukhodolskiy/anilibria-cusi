class App {
	constructor() {
		this.router = new Router(".page-container", "home", "not-found");
		this.auth = new Auth("#login .login-form form");
		this.renderer = new Renderer();
		this.postRender = new PostRender();
		this.loader = new Loader();

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

		const lmap = { 
			home: this.loader.homePageUpToLoad, 
			search: this.loader.searchPageUpToLoad, 
			genres: this.loader.genresPageUpToLoad 
		};
		for(let p in lmap) {
			const page = document.querySelector(`#${p}`);
			page.querySelector(`.more-btn`).addEventListener("click", e => {
				const renderContainer = page.querySelector(".render-container");
				const from = renderContainer.childNodes.length;
				page.querySelector(`.more-btn-wrap .preload-spinner`).classList.remove("dnone");
				page.querySelector(`.more-btn`).classList.add("dnone");

				lmap[p](from, resp => {
					page.querySelector(`.more-btn-wrap .preload-spinner`).classList.add("dnone");
					if(resp.length) {
						page.querySelector(`.more-btn`).classList.remove("dnone");
					}
					insertListToRenderContainer(renderContainer, resp);
				});
			});
		}
	}

	initGenres() {
		this.loader.genresList(items => {
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