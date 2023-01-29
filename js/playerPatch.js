const playerPatch = plId => {
	const pl = document.querySelector(`#${plId}`);
	const skipBox = pl.childNodes[0].childNodes[21].childNodes[0].childNodes[0];

	pl.childNodes[0].addEventListener("contextmenu", e => {
		e.stopImmediatePropagation();
	}, true);

	const fixSkin = () => {
		skipBox.style.borderRadius = "6px";
		skipBox.style.border = "0";

		const episodesListBtn = pl.childNodes[0].childNodes[16].childNodes[0].childNodes[0];
		episodesListBtn.style.borderRadius = "0 4px 4px 0";
	}

	fixSkin();

	window.player = {
		container: pl,
		element: pl.querySelector("video"),
		api: {
			next: () => {
				pl.childNodes[0].childNodes[8].childNodes[2].click();
			},

			back: () => {
				pl.childNodes[0].childNodes[6].childNodes[2].click();
			},

			playPause: () => {
				pl.childNodes[0].childNodes[7].childNodes[2].click();
			},

			muteUnmute: () => {
				pl.childNodes[0].childNodes[11].childNodes[2].click();
			},

			isMute: () => {
				return pl.childNodes[0].childNodes[11].childNodes[1].childNodes[0].style.visibility == "hidden";
			},

			mute: () => {
				if(!window.player.api.isMute()) {
					window.player.api.muteUnmute();
				}
			},

			unmute: () => {
				if(window.player.api.isMute()) {
					window.player.api.muteUnmute();
				}
			},

			isPlaying: () => {
				return pl.childNodes[0].childNodes[7].childNodes[1].childNodes[0].style.visibility == "hidden";
			},

			play: () => {
				if(!window.player.api.isPlaying()) {
					window.player.api.playPause();
				}
			},

			pause: () => {
				if(window.player.api.isPlaying()) {
					window.player.api.playPause();
				}
			},

			skipOpening: () => {
				if(pl.childNodes[0].childNodes[21].style.display != "none"){
					skipBox.click();
				}
			},
		}
	}

	player.element.addEventListener("ended", e => {
		player.api.next();
	});

	player.element.addEventListener("pause", e => {
		player.element.style.filter = "brightness(.6)";
	});

	player.element.addEventListener("play", e => {
		player.element.style.filter = "brightness(1)";
	});

	document.addEventListener("keyup", e => {
		if(e.keyCode == 78) { // n
			player.api.next();
		}

		if(e.keyCode == 66) { // b
			player.api.back();
		}

		if(e.keyCode == 83) { // s
			player.api.skipOpening();
		}
	});
}