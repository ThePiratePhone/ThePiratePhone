function getCredentials() {
	return JSON.parse(window.localStorage.getItem('credentials') as string) as Credentials;
}

function setCredentials(credentials: Credentials | CredentialsV2) {
	window.localStorage.setItem('credentials', JSON.stringify(credentials));
}

function getLocalTheme() {
	return JSON.parse(window.localStorage.getItem('theme') as string);
}

function setLocalTheme(theme: string) {
	window.localStorage.setItem('theme', JSON.stringify(theme));
}

function clearCredentials() {
	window.localStorage.removeItem('credentials');
}

function setPreferedCampaign(campaign: Campaign) {
	window.localStorage.setItem('preferedCampaign', JSON.stringify(campaign._id));
}
function getPreferedCampaign(): string {
	return JSON.parse(window.localStorage.getItem('preferedCampaign') as string);
}

function getCallingTime() {
	let totalTime: number | null = null;
	try {
		const initial = parseInt(JSON.parse(window.sessionStorage.getItem('callingtime') as string));
		totalTime = Date.now() - initial;
		window.sessionStorage.removeItem('callingtime');
	} catch (e) {
		console.error(e);
	}
	return totalTime;
}

function saveCallingTime() {
	window.sessionStorage.setItem('callingtime', JSON.stringify(Date.now()));
}

export {
	clearCredentials,
	getCallingTime,
	getCredentials,
	getLocalTheme,
	saveCallingTime,
	setCredentials,
	setLocalTheme,
	setPreferedCampaign,
	getPreferedCampaign
};
