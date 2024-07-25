import axios from 'axios';
import { useEffect, useState } from 'react';

import Logo from '../Assets/Logo.svg';

import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import Footer from '../Components/Footer';
import Loader from '../Components/Loader';
import { areaSorter } from '../Utils/Sorters';
import { clearCredentials, getCredentials, setCredentials } from '../Utils/Storage';
import { parseCampaign } from '../Utils/Utils';

async function Login(credentials: Credentials): Promise<LoginResponse> {
	try {
		const response = await axios.post(credentials.URL + '/caller/login', {
			phone: credentials.phone,
			pinCode: credentials.pinCode
		});
		if (response?.data?.data) {
			return { OK: true, Message: 'OK', data: response.data.data };
		} else {
			return { OK: false, Message: 'Unknown error', data: undefined };
		}
	} catch (err: any) {
		console.error(err);
		return { OK: false, Message: 'Unknown error', data: undefined };
	}
}

async function testOldToken(URL: string) {
	try {
		const oldCredentials = getCredentials();
		oldCredentials.URL = URL;
		return await Login(oldCredentials);
	} catch (err: any) {
		console.error(err);
		return { OK: false, Message: 'Unknown error', data: undefined };
	}
}

function CreateAccount({ URL }: { URL: string }) {
	const [Loading, setLoading] = useState(true);
	const [ErrorMessage, setErrorMessage] = useState<string | null>(null);
	const [Areas, setAreas] = useState<Array<Area>>([]);
	const navigate = useNavigate();

	async function getAreas(): Promise<Array<Area> | undefined> {
		try {
			const response = await axios.get(URL + '/getArea');
			if (typeof response == 'undefined') {
				return undefined;
			} else {
				return response.data.data;
			}
		} catch (err: any) {
			console.error(err);
			return undefined;
		}
	}

	function connect() {
		navigate('/');
	}

	useEffect(() => {
		getAreas().then(vals => {
			if (vals) {
				setAreas(vals.sort(areaSorter));
			} else {
				setErrorMessage('Une erreur est survenue');
			}
			setLoading(false);
		});
	}, []);

	function createAccount() {
		setLoading(true);

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
						setErrorMessage('Numéro de téléphone déjà utilisé');
					} else if (message === 'Invalid area password') {
						setErrorMessage('Clé invalide');
					} else if (message === 'Invalid pin code') {
						setErrorMessage('Code pin invalide');
					} else if (message === 'Wrong phone number') {
						setErrorMessage('Numéro de téléphone invalide');
					} else {
						setErrorMessage(message);
						console.error(err);
					}
				} else {
					setErrorMessage('Une erreur est survenue');
					console.error(err);
				}
				setLoading(false);
			});
	}

	function enter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			createAccount();
		}
	}

	function next(e: React.KeyboardEvent<HTMLInputElement>, id: string) {
		if (e.key === 'Enter') {
			document.getElementById(id)?.focus();
		}
	}

	return (
		<div className="LoginPageMain">
			<h1>Nouveau compte</h1>
			<select id="area" className="inputField">
				{Areas.map((area, i) => {
					return (
						<option key={i} value={area._id}>
							{area.name}
						</option>
					);
				})}
			</select>
			<input
				className="inputField"
				id="password"
				type="password"
				placeholder="Clé d'organisation"
				onKeyUp={e => {
					next(e, 'firstname');
				}}
			/>
			<input
				className="inputField"
				id="firstname"
				type="text"
				placeholder="Nom"
				onKeyUp={e => {
					next(e, 'phone');
				}}
			/>
			<input
				className="inputField"
				id="phone"
				type="tel"
				placeholder="Téléphone"
				onKeyUp={e => {
					next(e, 'pin');
				}}
			/>
			<input className="inputField" id="pin" type="tel" placeholder="Pin" maxLength={4} onKeyUp={enter} />
			<Button value="Créer un compte" onclick={createAccount} />
			<div className="NoAccount">
				Déjà un compte ?<div onClick={connect}>Par ici !</div>
			</div>
			{ErrorMessage ?? ''}
			{Loading ? <Loader /> : <></>}
		</div>
	);
}

function LoginBoard({
	chooseArea,
	URL
}: {
	chooseArea: (caller: Caller, credentials: Credentials, areas: AreaCombo) => void;
	URL: string;
}) {
	const [Loading, setLoading] = useState(true);
	const [ErrorMessage, setErrorMessage] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const credentials = getCredentials();
		if (credentials) {
			testOldToken(URL).then(result => {
				if (result.OK && result.data) {
					result.data.caller.pinCode = credentials.pinCode;
					chooseArea(result.data.caller, credentials, {
						area: result.data.areaCombo.area,
						campaignAvailable: parseCampaign(result.data.areaCombo.campaignAvailable)
					});
				} else {
					clearCredentials();
					setLoading(false);
				}
			});
		} else {
			setLoading(false);
		}
	}, [chooseArea]);

	function newAccount() {
		navigate('/NewAccount');
	}

	function connect() {
		setLoading(true);

		const credentials = {
			phone: (document.getElementById('phone') as HTMLInputElement).value,
			pinCode: (document.getElementById('pin') as HTMLInputElement).value,
			area: '',
			URL: URL
		};

		Login(credentials).then(result => {
			if (result.OK && result.data) {
				setCredentials(credentials);
				result.data.caller.pinCode = credentials.pinCode;
				chooseArea(result.data.caller, credentials, {
					area: result.data.areaCombo.area,
					campaignAvailable: parseCampaign(result.data.areaCombo.campaignAvailable)
				});
			} else {
				setErrorMessage('Identifiants invalides');
			}
			setLoading(false);
		});
	}

	function next(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			document.getElementById('pin')?.focus();
		}
	}

	function keyLogin(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			connect();
		}
	}

	return (
		<div className="LoginPageMain">
			<img src={Logo} />
			<input className="inputField" id="phone" type="tel" placeholder="Téléphone" onKeyUp={next} />
			<input className="inputField" maxLength={4} id="pin" type="tel" placeholder="Pin" onKeyUp={keyLogin} />
			<Button value="Se connecter" onclick={connect} />
			<div className="NoAccount">
				Pas de compte ? <div onClick={newAccount}>Par ici !</div>
			</div>
			{ErrorMessage ?? <></>}
			{Loading ? <Loader /> : <></>}
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
	return (
		<BrowserRouter>
			<div className="LoginPage">
				<Routes>
					<Route path="/" element={<LoginBoard URL={URL} chooseArea={chooseArea} />} />
					<Route path="/NewAccount" element={<CreateAccount URL={URL} />} />
				</Routes>
				<Footer />
			</div>
		</BrowserRouter>
	);
}

export default LoginPage;
