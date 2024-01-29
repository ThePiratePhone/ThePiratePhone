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
			.catch(() => resolve({ OK: false, Message: 'Unknown error', data: undefined }));
	});
}

function getAreas(): Promise<undefined | Array<{ name: string; _id: string }>> {
	return new Promise(resolve => {
		axios
			.get(`${URL}/getArea`)
			.then(result => {
				resolve(result.data.data);
			})
			.catch(err => {
				console.error(err);
				resolve(undefined);
			});
	});
}

function MobileLoginPage({ render }: { render: (caller: Caller, credentials: Credentials) => void }) {
	const [ButtonDisabled, setButtonDisabled] = useState(true);
	const [ButtonValue, setButtonValue] = useState('Connexion...');
	const [Areas, setAreas] = useState<Array<{ name: string; _id: string }>>([]);

	function loadAreas() {
		setButtonValue('Récupération en cours...');
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
				setButtonValue('Se connecter');
				setButtonDisabled(false);
			} else {
				setButtonValue('Échec de la connexion au serveur');
			}
		});
	}

	useEffect(() => {
		if (window.localStorage.getItem('credentials') != null) {
			testOldToken().then(result => {
				if (result.OK && result.data)
					return render(result.data, JSON.parse(window.localStorage.getItem('credentials') as string));
				window.localStorage.removeItem('credentials');
				loadAreas();
			});
		} else {
			loadAreas();
		}
	}, [render]);

	function click() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Connexion...');

		const credentials = {
			phone: (document.getElementById('phone') as HTMLInputElement).value,
			pinCode: (document.getElementById('pin') as HTMLInputElement).value,
			area: (document.getElementById('area') as HTMLInputElement).value
		};

		Login(credentials).then(result => {
			if (result.OK && result.data) {
				window.localStorage.setItem('credentials', JSON.stringify(credentials));
				render(result.data, credentials);
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
			click();
		}
	}

	return (
		<div className="LoginPage">
			<div className="LoginPageMain">
				<h1>Bienvenue sur Call Sphere</h1>
				<select disabled={ButtonDisabled} id="area" onChange={change}>
					{Areas.map((value, i) => {
						return (
							<option key={i} value={value._id}>
								{value.name}
							</option>
						);
					})}
				</select>
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

function DesktopLoginPage({ render }: { render: (caller: Caller, credentials: Credentials) => void }) {
	return (
		<div className="DesktopLoginPage">
			Une version de bureau ?<br />
			Un jour peut-être 😏 <br />
			En attendant, rendez-vous sur mobile !
		</div>
	);
}

function LoginPage({
	render,
	isMobile
}: {
	render: (caller: Caller, credentials: Credentials) => void;
	isMobile: boolean;
}) {
	return isMobile ? <MobileLoginPage render={render} /> : <DesktopLoginPage render={render} />;
}

export default LoginPage;
