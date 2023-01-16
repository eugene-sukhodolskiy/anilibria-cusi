class CacheProvider {
	constructor() {
		this.cache = {};
		this.lifetime = {};
		this.createAt = {};

		this.init();
		setInterval(() => {
			this.manager();
		}, 1000);
	}

	init() {
		let storage = localStorage.getItem("cache");
		if(storage) {
			storage = JSON.parse(storage);
			this.cache = storage.cache;
			this.lifetime = storage.lifetime;
			this.createAt = storage.createAt;
		}
	}

	setCache(key, data, lifetime) {
		this.cache[key] = data;
		this.lifetime[key] = lifetime;
		this.createAt[key] = Math.round((new Date()).getTime() / 1000);

		this.saveCache();
	}

	saveCache() {
		localStorage.setItem("cache", JSON.stringify({
			cache: this.cache,
			lifetime: this.lifetime,
			createAt: this.createAt
		}));
	}

	cacheable(key, code, callback, lifetime) {
		if(this.cache[key]) {
			return callback(this.cache[key]);
		}

		code(data => {
			this.setCache(key, data, lifetime);
			callback(data);
		});
	}

	unsetCache(key) {
		if(this.cache[key]) {
			delete this.cache[key] 
			delete this.lifetime[key] 
			delete this.createAt[key]
			this.saveCache();
		}
	}

	manager() {
		const currentTimestamp = Math.round((new Date()).getTime() / 1000);

		for(let key in this.cache) {
			if(!this.lifetime[key]) 
				continue;

			if(currentTimestamp - this.createAt[key] > this.lifetime[key]) {
				this.unsetCache(key);
			}
		}
	}
}