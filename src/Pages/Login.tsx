import axios from 'axios';
import { useEffect, useState } from 'react';

import Footer from '../Components/Footer';

const URL = 'https://dfg.freeboxos.fr:7000/api';

function Login(credentials: Credentials): Promise<LoginResponse> {
	return new Promise(resolve => {
		axios
			.post(`${URL}/login`, credentials)
			.catch(err => {
				console.error(err);
				resolve({ OK: false, Message: 'Unknown error', data: undefined });
			})
			.then(response => {
				if (typeof response == 'undefined') {
					resolve({ OK: false, Message: 'Unknown error', data: undefined });
				} else {
					resolve({ OK: true, Message: 'OK', data: response.data.data });
				}
			});
	});
}

async function testOldToken(): Promise<LoginResponse> {
	return new Promise(resolve => {
		const oldCredentials = window.localStorage.getItem('credentials') as string;
		Login(JSON.parse(oldCredentials as string))
			.then(resolve)
			.catch(err => {
				console.error(err);
				resolve({ OK: false, Message: 'Unknown error', data: undefined });
			});
	});
}

function CreateAccount({ connect }: { connect: () => void }) {
	const [ButtonValue, setButtonValue] = useState('Récupération en cours...');
	const [ButtonDisabled, setButtonDisabled] = useState(true);
	const [Areas, setAreas] = useState<Array<Area>>([]);

	function getAreas() {
		return new Promise<Array<Area> | undefined>(resolve => {
			axios
				.get(URL + '/getArea')
				.then(response => {
					if (typeof response == 'undefined') {
						resolve(undefined);
					} else {
						resolve(response.data.data);
					}
				})
				.catch(err => {
					console.error(err);
					resolve(undefined);
				});
		});
	}

	useEffect(() => {
		getAreas().then(vals => {
			if (vals) {
				setAreas(
					vals.sort((a, b) => {
						if (a.name > b.name) {
							return 1;
						} else if (a.name < b.name) {
							return -1;
						}
						return 0;
					})
				);
				setButtonValue('Créer un compte');
				setButtonDisabled(false);
			} else {
				setButtonValue('Une erreur est survenue');
			}
		});
	}, []);

	function createAccount() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification...');

		const credentials = {
			phone: (document.getElementById('phone') as HTMLInputElement).value,
			pinCode: (document.getElementById('pin') as HTMLInputElement).value,
			AreaPassword: (document.getElementById('password') as HTMLInputElement).value,
			area: (document.getElementById('area') as HTMLInputElement).value,
			CallerName: (document.getElementById('name') as HTMLInputElement).value
		};

		axios
			.post(URL + '/createCaller', credentials)
			.then(() => {
				setButtonDisabled(false);
				setButtonValue('Compte créé !');
				setTimeout(() => {
					connect();
				}, 3000);
			})
			.catch(err => {
				if (err.response.data) {
					const message = err.response.data.message;
					if (message === 'caller already exist') {
						setButtonValue('Numéro de téléphone déjà utilisé');
					} else if (message === 'Invalid area password') {
						setButtonValue('Clé invalide');
					} else if (message === 'Invalid pin code') {
						setButtonValue('Code pin invalide');
					} else if (message === 'Wrong phone number') {
						setButtonValue('Numéro de téléphone invalide');
					} else {
						setButtonValue(message);
						console.log(err);
					}
				} else {
					setButtonValue('Une erreur est survenue');
					console.log(err);
				}
				setButtonDisabled(false);
			});
	}

	function change() {
		if (ButtonValue === 'Créer un compte') return;
		setButtonValue('Créer un compte');
	}

	function enter(e: any) {
		if (e.key === 'Enter') {
			createAccount();
		}
	}

	function next(e: any, id: string) {
		if (e.key === 'Enter') {
			document.getElementById(id)?.focus();
		}
	}

	return (
		<div className="LoginPageMain">
			<h1>Nouveau compte</h1>
			<select disabled={ButtonDisabled} id="area">
				{Areas.map((area, i) => {
					return (
						<option key={i} value={area._id}>
							{area.name}
						</option>
					);
				})}
			</select>
			<input
				disabled={ButtonDisabled}
				className="inputField"
				id="password"
				type="password"
				placeholder="Clé d'organisation"
				onChange={change}
				onKeyUp={e => {
					next(e, 'name');
				}}
			/>
			<input
				disabled={ButtonDisabled}
				className="inputField"
				id="name"
				type="text"
				placeholder="Nom"
				onChange={change}
				onKeyUp={e => {
					next(e, 'phone');
				}}
			/>
			<input
				disabled={ButtonDisabled}
				className="inputField"
				id="phone"
				type="tel"
				placeholder="Téléphone"
				onChange={change}
				onKeyUp={e => {
					next(e, 'pin');
				}}
			/>
			<input
				disabled={ButtonDisabled}
				className="inputField"
				id="pin"
				type="tel"
				placeholder="Pin"
				maxLength={4}
				onChange={change}
				onKeyUp={enter}
			/>
			<div className="NavButton" onClick={createAccount}>
				<button className={ButtonDisabled ? 'ButtonDisabled' : ''} disabled={ButtonDisabled}>
					{ButtonValue}
				</button>
			</div>
			<div className="NoAccount">
				Déjà un compte ?<div onClick={connect}>Par ici !</div>
			</div>
		</div>
	);
}

function MobileLoginBoard({
	chooseArea,
	newAccount
}: {
	chooseArea: (caller: Caller, credentials: Credentials, areas: Array<AreaCombo>) => void;
	newAccount: () => void;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(true);
	const [ButtonValue, setButtonValue] = useState('Connexion...');

	useEffect(() => {
		if (window.localStorage.getItem('credentials') != null) {
			testOldToken().then(result => {
				if (result.OK && result.data) {
					result.data.areaCombo = result.data.areaCombo.sort((a: AreaCombo, b: AreaCombo) => {
						if (a.areaName > b.areaName) {
							return 1;
						} else if (a.areaName < b.areaName) {
							return -1;
						}
						return 0;
					});
					return chooseArea(
						result.data.caller,
						JSON.parse(window.localStorage.getItem('credentials') as string),
						result.data.areaCombo
					);
				} else {
					window.localStorage.removeItem('credentials');
					load();
				}
			});
		} else {
			load();
		}
	}, [chooseArea]);

	function load() {
		setButtonDisabled(false);
		setButtonValue('Se connecter');
	}

	function connect() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Connexion...');

		const credentials = {
			phone: (document.getElementById('phone') as HTMLInputElement).value,
			pinCode: (document.getElementById('pin') as HTMLInputElement).value,
			area: ''
		};

		Login(credentials).then(result => {
			if (result.OK && result.data) {
				window.localStorage.setItem('credentials', JSON.stringify(credentials));
				chooseArea(result.data.caller, credentials, result.data.areaCombo);
			} else {
				setButtonValue('Identifiants invalides');
				setButtonDisabled(false);
			}
		});
	}

	function change() {
		if (ButtonValue === 'Se connecter') return;
		setButtonValue('Se connecter');
	}

	function enter(e: any) {
		if (e.key === 'Enter') {
			connect();
		}
	}

	return (
		<div className="LoginPageMain">
			<h1>Bienvenue sur Call Sphere</h1>
			<input
				className="inputField"
				disabled={ButtonDisabled}
				id="phone"
				type="tel"
				onChange={change}
				placeholder="Téléphone"
			/>
			<input
				className="inputField"
				disabled={ButtonDisabled}
				maxLength={4}
				id="pin"
				type="tel"
				onChange={change}
				placeholder="Pin"
				onKeyDown={enter}
			/>
			<div className="NavButton">
				<button onClick={connect} className={ButtonDisabled ? 'ButtonDisabled' : ''}>
					{ButtonValue}
				</button>
			</div>
			<div className="NoAccount">
				Pas de compte ? <div onClick={newAccount}>Par ici !</div>
			</div>
		</div>
	);
}

function MobileLoginPage({
	chooseArea
}: {
	chooseArea: (caller: Caller, credentials: Credentials, areas: Array<AreaCombo>) => void;
}) {
	const [Page, setPage] = useState(<MobileLoginBoard newAccount={newAccount} chooseArea={chooseArea} />);

	function newAccount() {
		setPage(<CreateAccount connect={connect} />);
	}

	function connect() {
		setPage(<MobileLoginBoard chooseArea={chooseArea} newAccount={newAccount} />);
	}

	return (
		<div className="LoginPage">
			{Page}
			<Footer />
		</div>
	);
}

function DesktopLoginPage() {
	return (
		<div className="DesktopLoginPage">
			Une version de bureau ?<br />
			Un jour peut-être 😏 <br />
			En attendant, rendez-vous sur mobile !
		</div>
	);
}

function LoginPage({
	chooseArea,
	isMobile
}: {
	chooseArea: (caller: Caller, credentials: Credentials, areas: Array<AreaCombo>) => void;
	isMobile: boolean;
}) {
	return isMobile ? <MobileLoginPage chooseArea={chooseArea} /> : <DesktopLoginPage />;
}

export default LoginPage;
