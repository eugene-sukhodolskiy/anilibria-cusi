const playerPatch = plId => {
	const pl = document.querySelector(`#${plId}`);
	pl.childNodes[0].addEventListener("contextmenu", e => {
		e.stopImmediatePropagation();
	}, true);

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
			}
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
		if(e.keyCode == 78) {
			player.api.next();
		}

		if(e.keyCode == 66) {
			player.api.back();
		}
	});
}