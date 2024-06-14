import axios from 'axios';
import { useEffect, useState } from 'react';

import Logo from '../Assets/Logo.svg';

import Button from '../Components/Button';
import Footer from '../Components/Footer';
import { areaSorting, parseCampaign } from '../Utils';

function Login(credentials: Credentials) {
	return new Promise<LoginResponse>(resolve => {
		axios
			.post(credentials.URL + '/login', {
				phone: credentials.phone,
				pinCode: credentials.pinCode
			})
			.then(response => {
				if (response?.data?.data) {
					resolve({ OK: true, Message: 'OK', data: response.data.data });
				} else {
					resolve({ OK: false, Message: 'Unknown error', data: undefined });
				}
			})
			.catch(err => {
				console.error(err);
				resolve({ OK: false, Message: 'Unknown error', data: undefined });
			});
	});
}

async function testOldToken(URL: string): Promise<LoginResponse> {
	return new Promise(resolve => {
		const oldCredentials = JSON.parse(window.localStorage.getItem('credentials') as string);
		oldCredentials.URL = URL;
		Login(oldCredentials)
			.then(resolve)
			.catch(err => {
				console.error(err);
				resolve({ OK: false, Message: 'Unknown error', data: undefined });
			});
	});
}

function CreateAccount({ connect, URL }: { connect: () => void; URL: string }) {
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
				setAreas(vals.sort(areaSorting));
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
			CallerName: (document.getElementById('firstname') as HTMLInputElement).value
		};

		axios
			.post(URL + '/createCaller', credentials)
			.then(() => {
				connect();
			})
			.catch(err => {
				if (err.response.data?.message) {
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
						console.error(err);
					}
				} else {
					setButtonValue('Une erreur est survenue');
					console.error(err);
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
			<select disabled={ButtonDisabled} id="area" className="inputField">
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
					next(e, 'firstname');
				}}
			/>
			<input
				disabled={ButtonDisabled}
				className="inputField"
				id="firstname"
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
			<Button value={ButtonValue} type={ButtonDisabled ? 'ButtonDisabled' : ''} onclick={createAccount} />
			<div className="NoAccount">
				Déjà un compte ?<div onClick={connect}>Par ici !</div>
			</div>
		</div>
	);
}

function LoginBoard({
	chooseArea,
	newAccount,
	URL
}: {
	chooseArea: (caller: Caller, credentials: { phone: string; pinCode: string }, areas: AreaCombo) => void;
	newAccount: () => void;
	URL: string;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(true);
	const [ButtonValue, setButtonValue] = useState('Connexion...');

	useEffect(() => {
		if (window.localStorage.getItem('credentials') != null) {
			testOldToken(URL).then(result => {
				if (result.OK && result.data) {
					const campaigns = parseCampaign(result.data);
					return chooseArea(
						result.data.caller,
						JSON.parse(window.localStorage.getItem('credentials') as string),
						{ area: result.data.areaCombo.area, campaignAvailable: campaigns }
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
		setButtonValue('Se connecter');
		setButtonDisabled(false);
	}

	function connect() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Connexion...');

		const credentials = {
			phone: (document.getElementById('phone') as HTMLInputElement).value,
			pinCode: (document.getElementById('pin') as HTMLInputElement).value,
			area: '',
			URL: URL
		};

		Login(credentials).then(result => {
			if (result.OK && result.data) {
				window.localStorage.setItem('credentials', JSON.stringify(credentials));
				const campaigns = parseCampaign(result.data);
				chooseArea(result.data.caller, credentials, {
					area: result.data.areaCombo.area,
					campaignAvailable: campaigns
				});
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

	function next(e: any, value: number) {
		if (e.key === 'Enter') {
			if (value == 1) {
				document.getElementById('pin')?.focus();
			} else {
				connect();
			}
		}
	}

	return (
		<div className="LoginPageMain">
			<img src={Logo} />
			<input
				className="inputField"
				disabled={ButtonDisabled}
				id="phone"
				type="tel"
				onChange={change}
				placeholder="Téléphone"
				onKeyUp={e => next(e, 1)}
			/>
			<input
				className="inputField"
				disabled={ButtonDisabled}
				maxLength={4}
				id="pin"
				type="tel"
				onChange={change}
				placeholder="Pin"
				onKeyDown={e => next(e, 2)}
			/>
			<Button value={ButtonValue} onclick={connect} type={ButtonDisabled ? 'ButtonDisabled' : ''} />
			<div className="NoAccount">
				Pas de compte ? <div onClick={newAccount}>Par ici !</div>
			</div>
		</div>
	);
}

function LoginPage({
	chooseArea,
	URL
}: {
	chooseArea: (caller: Caller, credentials: { phone: string; pinCode: string }, areas: AreaCombo) => void;
	URL: string;
}) {
	const [Page, setPage] = useState(<LoginBoard URL={URL} newAccount={newAccount} chooseArea={chooseArea} />);

	function newAccount() {
		setPage(<CreateAccount URL={URL} connect={connect} />);
	}

	function connect() {
		setPage(<LoginBoard URL={URL} chooseArea={chooseArea} newAccount={newAccount} />);
	}

	return (
		<div className="LoginPage">
			{Page}
			<Footer />
		</div>
	);
}

export default LoginPage;
