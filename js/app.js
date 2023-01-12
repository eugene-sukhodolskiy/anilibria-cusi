const app = function() {
	this.router = new Router(".page-container", "home", "not-found");
	this.auth = new Auth("#login .login-form form");
	this.renderer = new Renderer();

	initRoutesEvents(this);
	this.router.urlMonitor();

	if(getSessionId()) {
		document.querySelector(".logout-btn").classList.remove("dnone");
		document.querySelector(".go-login-page-btn").classList.add("dnone");
	} else {
		document.querySelector(".logout-btn").classList.add("dnone");
		document.querySelector(".go-login-page-btn").classList.remove("dnone");
	}

	initPreloadSpinner(this);
	initBaseEvents(this);
}

document.addEventListener("DOMContentLoaded", e => {
	app();
});