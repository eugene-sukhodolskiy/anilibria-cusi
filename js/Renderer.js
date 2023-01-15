class Renderer {
	constructor() {}

	renderThumbnail(post) {
		const status = post.status.string ? post.status.string : "Завершен";
		return `
			<div class="component thumbnail">
				<img src="//anilibria.tv${post.posters.medium.url}" class="thumbnail-img">
				<img 
					src="data:image/jpeg;base64,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" 
					class="poster-placeholder"
				>
				<div class="hover-effect">
					<span class="mdi mdi-arrow-right"></span>
				</div>
				<div class="status">${status}</div>
				<div class="series">Серий ${post.player.series.last}</div>
			</div>
		`;
	}

	renderItemCard(post) {
		let genres = post.genres.join(", ");
		const thumb = this.renderThumbnail(post);

		let html = `<a href="#page:single;id${post.id}" class="no-decoration item-link">
			<div class="component card item-card" data-id="${post.id}">
				${thumb}
				<div class="info">
					<div class="title">${post.names.ru} (<span class="year">${post.season.year}</span>)</div>
					<div class="meta">
						<div class="genres">${genres}</div>
						<div class="type">${post.type.full_string}</div>
					</div>
				</div>
			</div>
		</a>`;

		return {
			string: html,
			node: app().postRender.itemCard(html)
		};
	}

	renderTorrents(post) {
		let html = `<div class="component torrents">`;

		for(let i=0; i<post.torrents.list.length; i++) {
			const torrent = post.torrents.list[i];
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

	renderFavoriteBtn(post) {
		const html = `<button class="std-btn btn-warning fav-btn dnone" data-id="${post.id}">
			<span class="state unset-from">
				<span class="mdi mdi-star"></span>
				В избранном
			</span>
			<span class="state set-to">
				<span class="mdi mdi-star-outline"></span>
				Добавить в избранное
			</span>
		</button>`;

		return {
			html: html,
			node: app().postRender.favoriteBtn(html, post.id)
		};
	}

	renderSingle(post) {
		let genres = this.renderGenresList(post.genres).html;
		const thumb = this.renderThumbnail(post);
		const torrents = this.renderTorrents(post);

		let html = `<div class="component single-item">
			<div class="std-row">
				${thumb}
				<div class="item-info">
					<h2 class="title"><strong>${post.names.ru}</strong> / ${post.names.en}</h2>
					<div class="time-period">${post.season.string || ""} ${post.season.year}</div>
					<div class="genres">${genres}</div>
					<div class="type">${post.type.full_string}</div>
					<div class="description">${post.description}</div>
					<div class="control-panel">
						<div class="fav-btn-wrap"></div>
					</div>
					${torrents}
				</div>
			</div>

			<div class="player" id="main-player-${post.id}"></div>
		</div>`;

		return {
			string: html,
			node: app().postRender.single(html, post)
		};
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
			node: app().postRender.genreBtn(html)
		};
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