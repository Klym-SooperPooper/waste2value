export class Permissions {
	get OS() {
		return 'android ';
	}

	static get camera() {
		switch (this.OS) {
			case 'android':
			default:
				return 'android.permission.CAMERA';
		}
	}

	static get location() {
		switch (this.OS) {
			case 'android':
			default:
				return 'android.permission.ACCESS_FINE_LOCATION';
		}
	}
}

const getPermissionBooleanStatus = (res) => (status) =>
	status.hasPermission ? res(true) : res(false);

const getAndroidPermission = (prm, _cordova) => {
	if (!prm) {
		throw new Error('prm is undefined');
	}
	if (!_cordova) {
		throw new Error('cordova is undefined');
	}

	const permissions = _cordova.plugins.permissions;

	const permPromise = new Promise(async (resolve) => {
		const alreadyHasCameraPerm = await new Promise((res, rej) =>
			permissions.checkPermission(prm, getPermissionBooleanStatus(res), rej)
		);

		if (alreadyHasCameraPerm) {
			return resolve(true);
		} else {
			const aquiredPerm = await new Promise((res, rej) =>
				permissions.requestPermission(prm, getPermissionBooleanStatus(res), rej)
			);
			if (!aquiredPerm) {
				// try-catch approach
				// return reject(new Error('User forbid camera usage'))

				// true-false response approach
				return resolve(false);
			}
			return resolve(true);
		}
	});

	return permPromise;
};

export const getPermission = async (prm, _cordova = window.cordova) => {
	const permissions = _cordova.plugins.permissions;

	if (permissions) {
		const permission = await getAndroidPermission(prm, _cordova);
		if (await permission) {
			return true;
		} else {
			return false;
		}
	}
	// handle ios permissions
	// else if (permissionsIOS) {}
	else {
		return true;
	}
};
