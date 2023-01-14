class Renderer {
	constructor() {}

	renderThumbnail(item) {
		return `
			<div class="component thumbnail">
				<img src="https://anilibria.tv/${item.posters.medium.url}" class="thumbnail-img">
				<img src="./imgs/poster-placeholder.jpg" class="poster-placeholder">
				<div class="hover-effect">
					<span class="mdi mdi-arrow-right"></span>
				</div>
				<div class="status">${item.status.string}</div>
				<div class="series">Серий ${item.player.series.last}</div>
			</div>
		`;
	}

	renderItemCard(item) {
		let genres = item.genres.join(", ");
		const thumb = this.renderThumbnail(item);

		let html = `<div class="component card item-card" data-id="${item.id}">
			${thumb}
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
			document.location.hash = `page:single;id${id}`;
		});

		item.querySelector(".thumbnail-img").addEventListener("load", e => {
			e.currentTarget.parentNode.parentNode.classList.add("load-ready");
		});

		return item;
	}

	renderTorrents(item) {
		let html = `<div class="component torrents">`;

		for(let i=0; i<item.torrents.list.length; i++) {
			const torrent = item.torrents.list[i];
			let size = torrent.total_size / 1024 / 1024;
			size = (size > 1024) 
				? (size / 1024).toString().split(".")[0] + "." + (size / 1024).toString().split(".")[1].substr(0,2) + " ГБ" 
				: size.toString().split(".")[0] + "." +  size.toString().split(".")[1].substr(0,2) + " МБ";
			html += `
				<div class="torrent" data-torrent-id="${torrent.torrent_id}">
					<div class="series">Серии ${torrent.series.string}</div>
					<div class="quality">${torrent.quality.string}</div>
					
					<div class="seed-leech">
						<span class="seed">
							<span class="mdi mdi-arrow-up"></span>
							${torrent.seeders}
						</span>
						<span class="leech">
							<span class="mdi mdi-arrow-down"></span>
							${torrent.leechers}
						</span>
					</div>
					<div class="download">
						<a href="//anilibria.tv${torrent.url}" class="std-btn btn-success" target="_blank">
							<span class="mdi mdi-download"></span>
							<span class="btn-label">Скачать</span>
							<span class="btn-tsize">${size}</span>
						</a>
					</div>
				</div>
			`;
		}

		html += "</div>";
		return html;
	}

	renderSingle(item) {
		let genres = this.renderGenresList(item.genres).html;
		const thumb = this.renderThumbnail(item);
		const torrents = this.renderTorrents(item);

		let html = `<div class="component single-item">
			<div class="std-row">
				${thumb}
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
					${torrents}
				</div>
			</div>

			<div class="player" id="main-player-${item.id}"></div>
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
			id: "main-player-"+data.id,
			default_quality: "720p",
			preroll_deny: "",
			file: []
		};


		for(let i in data.player.playlist) {
			let files = `[480p]//${data.player.host}${data.player.playlist[i].hls.sd}`;

			if(data.player.playlist[i].hls.hd) {
				files += `,[720p]//${data.player.host}${data.player.playlist[i].hls.hd}`;
			}

			if(data.player.playlist[i].hls.fhd) {
				files += `,[1080p]//${data.player.host}${data.player.playlist[i].hls.fhd}`;
			}
			
			playerData.file.push({
				id: "s"+i,
				skip: data.player.playlist[i].skips.opening.length ? data.player.playlist[i].skips.opening.join("-") : null,
				title: `Серия ${i}`,
				poster: null,
				download: null,
				file: files
			});
		}

		setTimeout(() => {
			let player = new Playerjs(playerData);
		}, 30);

		const sessId = getSessionId();
		if(sessId) {
			item.querySelector(".fav-btn .state.unset-from").classList.add("dnone");
			item.querySelector(".fav-btn .state.set-to").classList.remove("dnone");

			getFavouritesList(resp => {
				for(let i=0; i<resp.length; i++) {
					if(data.id == resp[i].id) {
						item.querySelector(".fav-btn .state.unset-from").classList.remove("dnone");
						item.querySelector(".fav-btn .state.set-to").classList.add("dnone");
						break;
					}
				}
				
				item.querySelector(".fav-btn").classList.remove("dnone");
			});
			
			// Add Listener for fav btn
			item.querySelector(".fav-btn").addEventListener("click", e => {
				if(e.currentTarget.querySelector(".unset-from").classList.contains("dnone")) {
					// ADD TO FAVOURITES
					stdXHR(
						"PUT", 
						"//api.anilibria.tv/api/v2/addFavorite?session="+sessId+"&title_id="+data.id,
						xhr => {
							item.querySelector(".fav-btn .state.unset-from").classList.remove("dnone");
							item.querySelector(".fav-btn .state.set-to").classList.add("dnone");
						}
					).send();
				} else {
					// REMOVE FROM FAVOURITES
					stdXHR(
						"DELETE", 
						"//api.anilibria.tv/api/v2/delFavorite?session="+sessId+"&title_id="+data.id,
						xhr => {
							item.querySelector(".fav-btn .state.unset-from").classList.add("dnone");
							item.querySelector(".fav-btn .state.set-to").classList.remove("dnone");
						}
					).send();
				}
			});
		}

		item.querySelector(".thumbnail-img").addEventListener("load", e => {
			e.currentTarget.parentNode.classList.add("load-ready");
		});

		return item;
	}

	renderPreloadSpinner() {
		return `<div class="loadingio-spinner-dual-ball-9pyhqeozhs"><div class="ldio-jyt13pqa73">
			<div></div><div></div><div></div>
			</div></div>`;
	}

	renderGenreBtn(genre) {
		let html = `<a 
			href="#page:genres;sg:${genre}" 
			class="std-btn genre-btn" 
			data-genre-name="${genre}"
		>
			${genre}
		</a>`;

		return {
			html: html,
			node: this.setEventsOnGenreBtn(html)
		};
	}

	setEventsOnGenreBtn(btn) {
		const container = document.createElement("DIV");
		container.innerHTML = btn;
		const item = container.querySelector(".genre-btn");

		item.addEventListener("click", e => {
			e.preventDefault();
			const genre = e.currentTarget.getAttribute("data-genre-name");
			let selectedGenres = document.location.hash.split("sg:")[1];
			selectedGenres = selectedGenres 
				? selectedGenres.split(",").map(item => { return decodeURI(item); }) 
				: [];

			const inx = selectedGenres.indexOf(genre);
			if(inx === -1) {
				selectedGenres.push(genre);
				e.currentTarget.classList.add("active");
			} else {
				selectedGenres.splice(inx, 1);
				e.currentTarget.classList.remove("active");
			}

			document.location.hash = "page:genres;sg:" + selectedGenres.join(",");
		});

		return item;
	}

	renderGenresList(genres) {
		let container = document.createElement("DIV");
		container.classList.add("genres-wrap");
		let html = `<div class="genres-wrap">`;
		for(let i=0; i<genres.length; i++) {
			const btn = this.renderGenreBtn(genres[i]);
			container.appendChild(btn.node);
			html += btn.html;
		}

		html += "</div>";

		return {
			html: html,
			node: container
		};
	}
}