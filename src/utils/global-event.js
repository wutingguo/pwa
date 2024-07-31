export class GlobalEvent {
	constructor(singleSpa) {
		this.singleSpa = singleSpa;
		this.stores = {};
	}

	registerStore(name, store) {
		this.stores[name] = store;
	}

	dispatch(event, ...opt) {
		Object.keys(this.stores).forEach(k => {
			const mountedAppNames = this.singleSpa.getMountedApps();
			const isMounted = mountedAppNames.indexOf(k) !== -1;

			if (isMounted) {
				this.stores[k].dispatch(event, ...opt);
			}
		});
	}
}