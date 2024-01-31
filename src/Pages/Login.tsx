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

function MobileLoginPage({
	chooseArea
}: {
	chooseArea: (caller: Caller, credentials: Credentials, areas: Array<AreaCombo>) => void;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(true);
	const [ButtonValue, setButtonValue] = useState('Connexion...');

	useEffect(() => {
		if (window.localStorage.getItem('credentials') != null) {
			testOldToken().then(result => {
				if (result.OK && result.data) {
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

	function click() {
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

	//function loadAreas() {
	//	setButtonValue('Récupération en cours...');
	//	getAreas().then(vals => {
	//		if (vals) {
	//			setAreas(
	//				vals.sort((a, b) => {
	//					if (a.name > b.name) {
	//						return 1;
	//					} else if (a.name < b.name) {
	//						return -1;
	//					}
	//					return 0;
	//				})
	//			);
	//			setButtonValue('Se connecter');
	//			setButtonDisabled(false);
	//		} else {
	//			setButtonValue('Échec de la connexion au serveur');
	//		}
	//	});
	//}

	function change() {
		if (ButtonValue === 'Se connecter') return;
		setButtonValue('Se connecter');
	}

	function enter(e: any) {
		if (e.key === 'Enter') {
			click();
		}
	}

	return (
		<div className="LoginPage">
			<div className="LoginPageMain">
				<h1>Bienvenue sur Call Sphere</h1>
				<input disabled={ButtonDisabled} id="phone" type="tel" onChange={change} placeholder="Téléphone" />
				<input
					disabled={ButtonDisabled}
					maxLength={4}
					id="pin"
					type="tel"
					onChange={change}
					placeholder="Pin"
					onKeyDown={enter}
				/>
				<div className="NavButton">
					<button onClick={click} className={ButtonDisabled ? 'ButtonDisabled' : ''}>
						{ButtonValue}
					</button>
				</div>
			</div>
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
