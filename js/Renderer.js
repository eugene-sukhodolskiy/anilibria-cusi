class Renderer {
	constructor() {

	}

	renderItemCard(item) {
		let genres = item.genres.join(", ");

		let html = `<div class="component card item-card" data-id="${item.id}">
			<div class="thumbnail-container">
				<div class="hover-effect">
					<span class="mdi mdi-arrow-right"></span>
				</div>
				<img src="https://anilibria.tv/${item.posters.medium.url}" class="thumbnail">
				<div class="status">${item.status.string}</div>
				<div class="series">Серий ${item.player.series.last}</div>
			</div>
			<div class="info">
				<div class="title">${item.names.ru} (<span class="year">${item.season.year}</span>)</div>
				<div class="meta">
					<div class="genres">${genres}</div>
					<div class="type">${item.type.full_string}</div>
				</div>
			</div>
		</div>`;

		return {
			string: html,
			node: this.setEventsOnItemCard(html)
		};
	}

	setEventsOnItemCard(item) {
		const container = document.createElement("DIV");
		container.innerHTML = item;
		item = container.querySelector(".card");

		item.addEventListener("click", e => {
			console.log("CLICK!", e.currentTarget.getAttribute("data-id"));
		});

		item.querySelector(".thumbnail").addEventListener("load", e => {
			e.currentTarget.parentNode.parentNode.classList.add("load-ready");
		});

		return item;
	}
}