function getCredentials() {
	return JSON.parse(window.localStorage.getItem('credentials') as string) as Credentials;
}

function setCredentials(credentials: Credentials) {
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

export { clearCredentials, getCredentials, getLocalTheme, setCredentials, setLocalTheme };
