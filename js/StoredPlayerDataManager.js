class StoredPlayerDataManager {
	constructor() {
		this.localStorageItemName = "player_data_backup";
		
		this.restorePlayerDataFromBackup();
		this.cleanupBackupedPlayerData();

		setInterval(() => {
			this.backupPlayerData();
		}, 3000);
		
		setInterval(() => {
			this.cleanupBackupedPlayerData();
		}, 5 * 60 * 1000);
	}

	backupPlayerData() {
		const playerData = getStorablePlayerData();
		const bPlayerData = this.getBackupedPlayerData();
		for(let id in playerData) {
			if(bPlayerData[id]) {
				bPlayerData[id].currentEpisode = playerData[id].currentEpisode;
				bPlayerData[id].timing.watched = playerData[id].timing.watched;
				bPlayerData[id].timing.len = playerData[id].timing.len;
			} else {
				bPlayerData[id] = playerData[id];
			}
		}

		localStorage.setItem(this.localStorageItemName, JSON.stringify(bPlayerData));
	}

	getBackupedPlayerData() {
		const backupedPlayerData = localStorage.getItem(this.localStorageItemName);
		if(!backupedPlayerData) {
			return {};
		}

		return JSON.parse(backupedPlayerData);
	}

	restorePlayerDataFromBackup() {
		const playerData = this.getBackupedPlayerData();
		const path = document.location.host + document.location.pathname;
		const timestamp = (new Date()).getTime();

		for(let id in playerData) {
			const episode = playerData[id].currentEpisode;
			const watched = playerData[id].timing.watched;
			const len = playerData[id].timing.len || 0;
			const data = `{x-${(episode-1)}-s${episode}}${watched}.0--${len}.0--${timestamp}`;
			localStorage.setItem(`pljsplayfrom_main-player-${id}${path}`, data);
		}
	}

	cleanupBackupedPlayerData() {
		const playerData = this.getBackupedPlayerData();
		let length = Object.keys(playerData).length;
		if(length <= 300) {
			return false;
		}

		let ID = -1;
		let watchedAt = Number.MAX_VALUE;
		for(let id in playerData) {
			if(playerData[id].timing.watchedAt < watchedAt) {
				ID = id;
				watchedAt = playerData[id].timing.watchedAt;
			}
		}

		playerData[ID] && delete playerData[ID];
		localStorage.setItem(this.localStorageItemName, JSON.stringify(playerData));
	}
}