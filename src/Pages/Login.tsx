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
			.then(result => {
				if (result.OK) {
					resolve(result);
				} else {
					resolve(result);
				}
			})
			.catch(() => resolve({ OK: false, Message: 'Unknown error', data: undefined }));
	});
}

function getAreas(): Promise<undefined | Array<{ name: string; _id: string }>> {
	//return new Promise(resolve => {
	//	resolve([
	//		{ name: 'Zone 1', id: 't1es231d56f' },
	//		{ name: 'Zone 2', id: 'dsfhce56s' }
	//	]);
	//});

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

function LoginPage({ render }: { render: (caller: Caller, credentials: Credentials) => void }) {
	const [ButtonEnabled, setButtonEnabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Connexion...');
	const [Areas, setAreas] = useState(Array<{ name: string; _id: string }>());

	function loadButtonAndAreas() {
		setButtonValue('Récupération en cours...');
		getAreas().then(vals => {
			if (vals) {
				setAreas(vals);
				setButtonValue('Se connecter');
				setButtonEnabled(true);
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
				loadButtonAndAreas();
			});
		} else {
			loadButtonAndAreas();
		}
	}, [render]);

	useEffect(() => {
		const phone = document.getElementById('phone') as HTMLInputElement;
		const pin = document.getElementById('pin') as HTMLInputElement;
		const areas = document.getElementById('area') as HTMLInputElement;
		if (ButtonEnabled) {
			phone.disabled = false;
			pin.disabled = false;
			areas.disabled = false;
		} else {
			phone.disabled = true;
			pin.disabled = true;
			areas.disabled = true;
		}
	}, [ButtonEnabled]);

	function click() {
		if (!ButtonEnabled) return;
		setButtonEnabled(false);
		setButtonValue('Connexion...');

		const credentials = {
			phone: (document.getElementById('phone') as HTMLInputElement).value,
			pinCode: (document.getElementById('pin') as HTMLInputElement).value as string,
			area: (document.getElementById('area') as HTMLInputElement).value
		};

		Login(credentials).then(result => {
			if (result.OK && result.data) {
				window.localStorage.setItem('credentials', JSON.stringify(credentials));
				render(result.data, credentials);
			} else {
				setButtonValue('Identifiants invalides');
				setButtonEnabled(true);
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
				<select id="area" onChange={change}>
					{Areas.map((value, i) => {
						return (
							<option key={i} value={value._id}>
								{value.name}
							</option>
						);
					})}
				</select>
				<datalist id="AreaList"></datalist>
				<input id="phone" type="tel" onChange={change} placeholder="Téléphone" />
				<input maxLength={4} id="pin" type="tel" onChange={change} placeholder="Pin" onKeyDown={enter} />
				<div className="NavButton">
					<button onClick={click} className={ButtonEnabled ? '' : 'ButtonDisabled'}>
						{ButtonValue}
					</button>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default LoginPage;
