class App {
	constructor() {
		this.router = new Router(".page-container", "home", "not-found");
		this.auth = new Auth("#login .login-form form");
		this.renderer = new Renderer();
		this.postRender = new PostRender();
		this.loader = new Loader();
		this.cacheProvider = new CacheProvider();
		this.storedPlayerDataManager = new StoredPlayerDataManager();
		this.sync = new Sync();

		setTimeout(() => {
			this.init();
		}, 10);
	}

	init() {
		initers(this);
		this.router.urlMonitor();

		this.initDisplayingAuthBtns();
		this.initPreloadSpinner();
		this.initBaseEvents();
		this.initGenres();
		this.initGoToTopBtn();
		this.initNightMode();
	}

	initNightMode() {
		const hours = (new Date()).getHours();
		if(hours <= 8 || hours >= 20) {
			document.querySelector("body").classList.add("night-mode");
		} else {
			document.querySelector("body").classList.remove("night-mode");
		}

		setTimeout(() => this.initNightMode(), 60 * 1000);
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
				const pageNum = Math.ceil(renderContainer.childNodes.length / _CONF.perPage[p]) + 1;
				page.querySelector(`.more-btn-wrap .preload-spinner`).classList.remove("dnone");
				page.querySelector(`.more-btn`).classList.add("dnone");

				lmap[p](pageNum, resp => {
					page.querySelector(`.more-btn-wrap .preload-spinner`).classList.add("dnone");
					if(resp.list.length) {
						page.querySelector(`.more-btn`).classList.remove("dnone");
					}
					insertListToRenderContainer(renderContainer, resp.list);
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

	initGoToTopBtn() {
		const goTopBtn = document.querySelector(".go-to-top");

		const goTopBtnVisibilityHandler = () => {
			if(window.pageYOffset > 500) {
				if(!goTopBtn.classList.contains("show")) {
					goTopBtn.classList.add("show");
				}
			} else {
				if(goTopBtn.classList.contains("show")) {
					goTopBtn.classList.remove("show");
				}
			}
		}

		goTopBtnVisibilityHandler();

		window.addEventListener("scroll", e => {
			goTopBtnVisibilityHandler();
		});

		goTopBtn.addEventListener("click", e => {
			const duration = 50;
			const step = Math.round(window.pageYOffset / duration);

			const animationInterval = setInterval(() => {
				const newPageYOffset = Math.max(0, window.pageYOffset - step);

				window.scrollTo({
					top: newPageYOffset 
				});

				if(!newPageYOffset) {
					return clearInterval(animationInterval);
				}
			}, 1);
		});
	}
}

document.addEventListener("DOMContentLoaded", e => {
	const app = new App();
	window.app = () => app;
});