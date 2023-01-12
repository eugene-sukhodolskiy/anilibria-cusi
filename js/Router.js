class Router {
	constructor(pagesContainerSelector, defaultPageId, notFoundPageId) {
		this.containerSelector = pagesContainerSelector;
		this.container = document.querySelector(this.containerSelector);
		this.defaultPageId = defaultPageId;
		this.notFoundPageId = notFoundPageId;
		this.events = {};
		const findedPages = this.container.querySelectorAll(".page[id]");

		this.pages = {};
		for(let i=0; i<findedPages.length; i++) {
			this.pages[findedPages[i].getAttribute("id")] = findedPages[i];
		}

		this.currentPage = "default-val";
		this.currentPath = "default-val";
		this.zindex = 1;
	}

	goToPage(pageId) {
		if(typeof pageId == "undefined" || typeof this.pages[pageId] == "undefined") {
			return document.location.hash = `page:${this.defaultPageId}`;
		}

		this.container.querySelectorAll(".page.show").forEach( p => {
			return p.classList.remove("show");
		} );

		if(typeof this.pages[pageId] != "undefined") {
			this.events["jumpTo"] && this.events["jumpTo"](this, pageId);
			this.events[pageId] && this.events[pageId](this);
			this.pages[pageId].style.zIndex = this.zindex;
			this.zindex++;
		}

		this.pages[pageId]?.classList.add("show");
		window.scrollTo({ top: 0 });
		this.currentPage = pageId;
		this.currentPath = document.location.hash;
	}

	urlMonitor() {
		setInterval(() => {
			const route = document.location.hash.split("page:")[1];
			//route?.split(";")[0] != this.currentPage
			if(document.location.hash != this.currentPath) {
				this.goToPage(route?.split(";")[0]);
			}
		}, 10);
	}

	addEvent(name, callback) {
		this.events[name] = callback;
	}
}