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

	document.querySelector(`[name="search"]`).addEventListener("keyup", e => {
		e.preventDefault();
		if(e.keyCode == 13) {
			let squery = e.currentTarget.value.trim();
			document.location.hash = `page-search;sq:${squery}`;
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