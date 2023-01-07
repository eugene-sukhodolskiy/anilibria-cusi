class Auth {
	constructor(formSelector) {
		this.formSelector = formSelector;
		this.form = document.querySelector(this.formSelector);
		this.submitBtn = this.form.querySelector(".submit-btn");
		this.initForm();
	}

	initForm() {
		this.form.addEventListener("submit", e => {
			e.preventDefault();
			if(this.submitBtn.classList.contains("disable")) {
				return;
			}

			this.submitBtn.classList.add("disable");

			const email = this.form.querySelector("#email").value;
			const passwd = this.form.querySelector("#passwd").value;

			const xhr = new XMLHttpRequest();
			xhr.open("POST", "https://www.anilibria.tv/public/login.php");
			xhr.onload = () => {
				this.submitBtn.classList.remove("disable");

				if(xhr.status == 200) {
					const resp = JSON.parse(xhr.response);
					if(resp.err == "ok") {
						localStorage.setItem("sessionId", resp.sessionId);
						const alert = createGlobalAlertComponent("success", "Успешно!");
						setTimeout(() => {
							alert.close();
						}, 2000);
						document.location.hash = "#";
						document.querySelector(".logout-btn").classList.remove("dnone");
						document.querySelector(".go-login-page-btn").classList.add("dnone");
					} else {
						const alert = createGlobalAlertComponent("danger", resp.mes);
						setTimeout(() => {
							alert.close();
						}, 4500);
					}
				} else {
					const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
					setTimeout(() => {
						alert.close();
					}, 4500);
				}				
			}

			const fdata = new FormData();
			fdata.append("mail", email);
			fdata.append("passwd", passwd);
			fdata.append("fa2code", "");
			fdata.append("csrf", "1");
			xhr.send(fdata);
		});
	}

	logout() {
		localStorage.removeItem("sessionId");
		document.location.hash = "#page-login";
		document.querySelector(".logout-btn").classList.add("dnone");
		document.querySelector(".go-login-page-btn").classList.remove("dnone");
	}
}