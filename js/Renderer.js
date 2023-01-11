class Renderer {
	constructor() {

	}

	renderItemCard(item) {
		let genres = item.genres.join(", ");

		let html = `<div class="component card item-card" data-id="${item.id}">
			<div class="component thumbnail">
				<div class="hover-effect">
					<span class="mdi mdi-arrow-right"></span>
				</div>
				<img src="https://anilibria.tv/${item.posters.medium.url}" class="thumbnail-img">
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
			const id = e.currentTarget.getAttribute("data-id");
			document.location.hash = `page-single;id${id}`;
		});

		item.querySelector(".thumbnail-img").addEventListener("load", e => {
			e.currentTarget.parentNode.parentNode.classList.add("load-ready");
		});

		return item;
	}

	renderSingle(item) {
		let genres = item.genres.join(", ");

		let html = `<div class="component single-item">
			<div class="std-row">
				<div class="component thumbnail">
					<div class="hover-effect">
						<span class="mdi mdi-arrow-right"></span>
					</div>
					<img src="https://anilibria.tv/${item.posters.medium.url}" class="thumbnail-img">
					<div class="status">${item.status.string}</div>
					<div class="series">Серий ${item.player.series.last}</div>
				</div>
				<div class="item-info">
					<h2 class="title"><strong>${item.names.ru}</strong> / ${item.names.en}</h2>
					<div class="time-period">${item.season.string} ${item.season.year}</div>
					<div class="genres">${genres}</div>
					<div class="type">${item.type.full_string}</div>
					<div class="description">${item.description}</div>
					<div class="control-panel">
						<button class="std-btn btn-warning fav-btn dnone" data-id="${item.id}">
							<span class="state unset-from">
								<span class="mdi mdi-star"></span>
								В избранном
							</span>
							<span class="state set-to">
								<span class="mdi mdi-star-outline"></span>
								Добавить в избранное
							</span>
						</button>
					</div>
				</div>
			</div>

			<div class="player" id="main-player">
				
			</div>
		</div>`;

		return {
			string: html,
			node: this.setEventsOnSingle(html, item)
		};
	}

	setEventsOnSingle(item, data) {
		const container = document.createElement("DIV");
		container.innerHTML = item;
		item = container.querySelector(".single-item");

		const playerData = {
			id: "main-player",
			default_quality: "720p",
			preroll_deny: "",
			file: []
		};

		for(let i in data.player.playlist) {
			playerData.file.push({
				id: "s"+i,
				skip: null,
				title: `Серия ${i}`,
				poster: null,
				download: null,
				file: `[480p]//${data.player.host}${data.player.playlist[i].hls.sd},[720p]//${data.player.host}${data.player.playlist[i].hls.hd},[1080p]//${data.player.host}${data.player.playlist[i].hls.fhd}`
			});
		}

		setTimeout(() => {
			let player = new Playerjs(playerData);
		}, 30);

		const sessId = getSessionId();
		if(sessId) {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", "http://api.anilibria.tv/api/v2/getFavorites?session="+sessId+"&limit=100");
			xhr.onload = () => {
				item.querySelector(".fav-btn .state.unset-from").classList.add("dnone");
				item.querySelector(".fav-btn .state.set-to").classList.remove("dnone");
				if(xhr.status == 200) {
					const resp = JSON.parse(xhr.response);
					for(let i=0; i<resp.length; i++) {
						if(data.id == resp[i].id) {
							item.querySelector(".fav-btn .state.unset-from").classList.remove("dnone");
							item.querySelector(".fav-btn .state.set-to").classList.add("dnone");
							break;
						}
					}
					
					item.querySelector(".fav-btn").classList.remove("dnone");
				} else {
					const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
				}
			}

			xhr.onerror = () => {
				const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
			}
			xhr.send();
			
			// Add Listener for fav btn
			item.querySelector(".fav-btn").addEventListener("click", e => {
				console.log("click fav");
				const xhr = new XMLHttpRequest();
				if(e.currentTarget.querySelector(".unset-from").classList.contains("dnone")) {
					// ADD TO FAVOURITES
					xhr.open("PUT", "http://api.anilibria.tv/api/v2/addFavorite?session="+sessId+"&title_id="+data.id);
					xhr.onload = () => {
						if(xhr.status == 200) {
							item.querySelector(".fav-btn .state.unset-from").classList.remove("dnone");
							item.querySelector(".fav-btn .state.set-to").classList.add("dnone");
						} else {
							const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
						}
					}
				} else {
					// REMOVE FROM FAVOURITES
					xhr.open("DELETE", "http://api.anilibria.tv/api/v2/delFavorite?session="+sessId+"&title_id="+data.id);
					xhr.onload = () => {
						if(xhr.status == 200) {
							item.querySelector(".fav-btn .state.unset-from").classList.add("dnone");
							item.querySelector(".fav-btn .state.set-to").classList.remove("dnone");
						} else {
							const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
						}
					}
				}

				xhr.onerror = () => {
					const alert = createGlobalAlertComponent("danger", "Сервер не доступен");
				}
				xhr.send();
			});
		}

		return item;
	}
}