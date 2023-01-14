class PostRender {
	constructor() {}

	itemCard(html) {
		const container = document.createElement("DIV");
		container.innerHTML = html;
		const item = container.querySelector(".card");

		item.addEventListener("click", e => {
			const id = e.currentTarget.getAttribute("data-id");
			document.location.hash = `page:single;id${id}`;
		});

		item.querySelector(".thumbnail-img").addEventListener("load", e => {
			e.currentTarget.parentNode.parentNode.classList.add("load-ready");
		});

		return item;
	}

	single(html, data) {
		const container = document.createElement("DIV");
		container.innerHTML = html;
		const item = container.querySelector(".single-item");

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

	genreBtn(html) {
		const container = document.createElement("DIV");
		container.innerHTML = html;
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
}