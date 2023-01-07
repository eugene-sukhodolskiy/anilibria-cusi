class Alert {
	constructor(type, content, isSingleton, isClosable) {
		this.id = "alert-id-" + (new Date()).getTime() + Math.random();
		alertsList[this.id] = this;
		this.type = type;
		this.content = content || "";
		this.isSingleton = isSingleton || false;
		this.isClosable = isClosable || false;

		const referenceComponent = document.querySelector(`.component.alert[data-id="alert-id-reference"]`);
		if(!referenceComponent){
			return console.error("Reference of alert component not found");
		}

		this.template = referenceComponent.cloneNode(true);
		this.template.getInstance = () => this;
		this.initComponent();
	}

	initComponent() {
		this.template.classList.add(`alert-${this.type}`);
		this.template.setAttribute("data-id", this.id);
		this.template.querySelector(".content").innerHTML = this.content;

		this.template.querySelector(".close-alert").addEventListener("click", e => {
			e.preventDefault();
			this.close();
		});
	}

	showIn(container) {
		if(!this.template){
			return false;
		}

		if(this.isSingleton){
			container.innerHTML = "";
		}
		container.append(this.template);
		setTimeout(() => {
			this.template.classList.add("show");
		}, 10);

		return this;
	}

	close() {
		this.template.classList.remove("show");
		setTimeout(() => {
			this.template.remove();
			delete alertsList[this.id];
		}, 150);
	}

	changeContent(newContent) {
		this.template.querySelector(".content").innerHTML = newContent;
	}
}

const closeAlertComponent = alertId => {
	return alertsList[alertId]?.close();
}

const createAlertComponent = (type, content, isSingleton, isClosable) => {
	return new Alert(type, content, isSingleton, isClosable);
}

const createGlobalAlertComponent = (type, content, isSingleton, isClosable) => {
	const alert = createAlertComponent(type, content, isSingleton, isClosable);
	alert.showIn(document.querySelector(".global-alerts-container"));
	return alert;
}

document.addEventListener("DOMContentLoaded", e => {
	document.querySelectorAll(`.component.alert .close-alert`).forEach(item => {
		item.addEventListener("click", e => {
			e.preventDefault();
			const alertId = e.currentTarget.getAttribute("data-close-alert-id");
			closeAlertComponent(alertId);
		});
	});
});

const alertsList = {};