class Sync {
	constructor() {
		this.errFlag = false;

		this.sync();
		setInterval(() => this.sync(), 30 * 1000);
	}

	sync() {
		const uemail = localStorage.getItem("uemail");
		if(this.errFlag || !getSessionId() || !uemail) {
			this.errFlag = true;
			return ;
		}

		console.log("sync start");
		
		const xhr = stdXHR("GET", _CONF.sync.url + `?uemail=${uemail}`, resp => {
			const result = JSON.parse(resp.response).result;

			if(result.uemail != uemail) {
				console.error(`User like a "${$uemail}" not found`);
			}

			const stored = app().storedPlayerDataManager.getBackupedPlayerData();
			for(let id in result.data) {
				if(!stored[id]) {
					stored[id] = result.data[id];
					continue;
				}

				if(result.data[id].timing.watchedAt > stored[id].timing.watchedAt) {
					stored[id] = result.data[id];
				}
			}

			app().storedPlayerDataManager.backupPlayerData(stored);
			app().storedPlayerDataManager.restorePlayerDataFromBackup();
			this.push();
		});

		xhr.onerror = () => {};
		xhr.send();
	}

	push() {
		const uemail = localStorage.getItem("uemail");
		if(!getSessionId() || !uemail) {
			this.errFlag = true;
			return ;
		}

		const preparedData = new FormData();
		preparedData.append("uemail", uemail);
		preparedData.append("data", JSON.stringify(app().storedPlayerDataManager.getBackupedPlayerData()));
		
		const xhr = stdXHR("POST", _CONF.sync.url, resp => {
			console.log("finished");
		});

		xhr.onerror = () => {};
		xhr.send(preparedData);
	}
}