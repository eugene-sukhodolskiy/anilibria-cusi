class PostRender {
	constructor() {}

	itemCard(html) {
		const item = nodeFromHTML(html);

		item.querySelector(".thumbnail-img").addEventListener("load", e => {
			e.currentTarget.parentNode.parentNode.classList.add("load-ready");
		});

		return item;
	}

	single(html, post) {
		const item = nodeFromHTML(html);

		const playerData = {
			id: "main-player-" + post.id,
			default_quality: "720p",
			preroll_deny: "",
			file: []
		};


		for(let i in post.player.playlist) {
			let files = `[480p]https://${post.player.host}${post.player.playlist[i].hls.sd}`;

			if(post.player.playlist[i].hls.hd) {
				files += `,[720p]https://${post.player.host}${post.player.playlist[i].hls.hd}`;
			}

			if(post.player.playlist[i].hls.fhd) {
				files += `,[1080p]https://${post.player.host}${post.player.playlist[i].hls.fhd}`;
			}

			playerData.file.push({
				id: "s"+i,
				skip: post.player.playlist[i].skips.opening.length ? post.player.playlist[i].skips.opening.join("-") : null,
				title: `Серия ${i}`,
				poster: null,
				download: null,
				file: files
			});
		}

		setTimeout(() => {
			let player = new Playerjs(playerData);
		}, 30);

		item.querySelector(".fav-btn-wrap").appendChild(app().renderer.renderFavoriteBtn(post).node);

		item.querySelector(".thumbnail-img").addEventListener("load", e => {
			e.currentTarget.parentNode.classList.add("load-ready");
		});

		return item;
	}

	favoriteBtn(html, postId) {
		const item = nodeFromHTML(html);

		const sessId = getSessionId();
		if(sessId) {
			item.querySelector(".state.unset-from").classList.add("dnone");
			item.querySelector(".state.set-to").classList.remove("dnone");

			app().loader.favouritesList(resp => {
				for(let i=0; i<resp.length; i++) {
					if(postId == resp[i].id) {
						item.querySelector(".state.unset-from").classList.remove("dnone");
						item.querySelector(".state.set-to").classList.add("dnone");
						break;
					}
				}
				
				item.classList.remove("dnone");
			});
			
			item.addEventListener("click", e => {
				if(e.currentTarget.querySelector(".unset-from").classList.contains("dnone")) {
					addToFavourites(postId, resp => {
						item.querySelector(".state.unset-from").classList.remove("dnone");
						item.querySelector(".state.set-to").classList.add("dnone");
					});
				} else {
					removeFromFavourites(postId, resp => {
						item.querySelector(".state.unset-from").classList.add("dnone");
						item.querySelector(".state.set-to").classList.remove("dnone");
					});
				}
			});
		}

		return item;
	}

	genreBtn(html) {
		const item = nodeFromHTML(html);

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