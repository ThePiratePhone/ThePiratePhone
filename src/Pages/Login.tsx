import axios from 'axios';
import { useEffect, useState } from 'react';
import Footer from '../Components/Footer';

const URL = 'https://dfg.freeboxos.fr:7000/api';

function Login(credentials: { number: string; pin: string; area: string }): Promise<LoginResponse> {
	return new Promise(resolve => {
		axios
			.post(`${URL}/login`, { phone: credentials.number, pinCode: credentials.pin, area: credentials.area })
			.catch(() => {
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

function getAreas(): Promise<undefined | Array<{ name: string; id: string }>> {
	return new Promise(resolve => {
		resolve([
			{ name: 'Zone 1', id: 't1es231d56f' },
			{ name: 'Zone 2', id: 'dsfhce56s' }
		]);
	});

	return new Promise(resolve => {
		axios
			.get(`${URL}/getAreas`)
			.then(result => {
				resolve(JSON.parse(result.data.data));
			})
			.catch(() => {
				resolve(undefined);
			});
	});
}

function LoginPage({ render }: { render: (caller: Caller) => void }) {
	const [ButtonEnabled, setButtonEnabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Connexion en cours...');
	const [Areas, setAreas] = useState(Array<{ name: string; id: string }>());

	function loadButtonAndAreas() {
		setButtonValue('Récupération en cours...');
		getAreas().then(vals => {
			if (vals) {
				setAreas(vals);
				setButtonValue('Se connecter');
				setButtonEnabled(true);
			} else {
				setButtonValue('Échec de la connexion à Internet');
			}
		});
	}

	useEffect(() => {
		if (window.localStorage.getItem('credentials') != null) {
			testOldToken().then(result => {
				if (result.OK && result.data) return render(result.data);
				window.localStorage.removeItem('credentials');
				setButtonValue('Récupération en cours...');
				loadButtonAndAreas();
			});
		} else {
			loadButtonAndAreas();
		}
	}, []);

	console.log('Test');

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
		setButtonValue('Connection...');

		const area = Areas.find(val => val.name == (document.getElementById('area') as HTMLInputElement).value)?.id;

		if (!area) return;

		const credentials = {
			number: (document.getElementById('phone') as HTMLInputElement).value,
			pin: (document.getElementById('pin') as HTMLInputElement).value as string,
			area: area
		};

		Login(credentials).then(result => {
			if (result.OK && result.data) {
				window.localStorage.setItem('credentials', JSON.stringify(credentials));
				render(result.data);
			} else {
				setButtonValue('Identifiants invalides');
				setButtonEnabled(true);
			}
		});
	}

	function change() {
		if (ButtonValue == 'Se connecter') return;
		setButtonValue('Se connecter');
	}

	return (
		<div className="LoginPage">
			<div className="LoginPageMain">
				<h1>Bienvenue sur Call Sphere</h1>
				<input id="area" list="AreaList" placeholder="Organisation" onChange={change} />
				<datalist id="AreaList">
					{Areas.map(value => {
						return <option value={value.name}></option>;
					})}
				</datalist>
				<input id="phone" type="tel" onChange={change} placeholder="Téléphone" />
				<input id="pin" type="password" onChange={change} placeholder="Pin" />
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
