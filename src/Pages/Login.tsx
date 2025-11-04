import { HashRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { useEffect, useState } from 'react';

import ApiUrl from '..';
import Logo from '../Assets/Logo.svg';
import Button from '../Components/Button';
import Footer from '../Components/Footer';
import Loader from '../Components/Loader';
import {
	clearCredentials,
	getCredentials,
	getPreferredCampaign,
	setCredentials,
	setPreferredCampaign
} from '../Utils/Storage';
import { parseCampaign } from '../Utils/Utils';
function login(credentials: CredentialsV2): Promise<LoginResponse> {
	return new Promise<LoginResponse>(resolve => {
		axios
			.post(credentials.URL + '/caller/login', {
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

function testOldToken(URL: string) {
	return new Promise<LoginResponse>(resolve => {
		const oldCredentials = getCredentials();
		oldCredentials.URL = URL;
		login(oldCredentials)
			.then(resolve)
			.catch(err => {
				console.error(err);
				resolve({ OK: false, Message: 'Unknown error', data: undefined });
			});
	});
}

function LoginBoard({
	renderApp
}: {
	renderApp: (caller: Caller, credentials: CredentialsV2, campaigns: Array<Campaign>, campaign: Campaign) => void;
}) {
	const [Loading, setLoading] = useState(false);
	const [ErrorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		const credentials = getCredentials();
		const preferredCampaignId = getPreferredCampaign();
		console.log(credentials, preferredCampaignId);

		if (credentials && preferredCampaignId) {
			testOldToken(ApiUrl).then(result => {
				const preferredCampaign = result?.data?.campaignAvailable.find(el => el._id == preferredCampaignId);
				if (result.OK && result.data && preferredCampaign) {
					result.data.caller.pinCode = credentials.pinCode;

					renderApp(result.data.caller, credentials, result.data.campaignAvailable, preferredCampaign);
				} else {
					clearCredentials();
					setLoading(false);
				}
			});
		}
	}, []);

	function connect() {
		setLoading(true);
		setErrorMessage(null);

		const credentials = {
			phone: (document.getElementById('phone') as HTMLInputElement).value,
			pinCode: (document.getElementById('pin') as HTMLInputElement).value
		};

		axios
			.post(ApiUrl + '/caller/login', credentials)
			.then(response => {
				if (response?.data?.OK) {
					const data = response.data.data;
					if (data) {
						const campaignAvailable = parseCampaign(data.campaignAvailable);

						const newCredentials: CredentialsV2 = {
							phone: credentials.phone,
							pinCode: credentials.pinCode,
							URL: ApiUrl,
							campaign: campaignAvailable[0]._id
						};
						setCredentials(newCredentials);

						const preferedCampaignId = getPreferredCampaign();
						if (preferedCampaignId) {
							const preferedCampaign = campaignAvailable.find(el => el._id == preferedCampaignId);
							if (preferedCampaign) {
								newCredentials.campaign = preferedCampaign._id;
								renderApp(data.caller, newCredentials, campaignAvailable, preferedCampaign);
							} else {
								const newPrefered = campaignAvailable.find(el => el.callPermited);
								setPreferredCampaign(newPrefered ? newPrefered : campaignAvailable[0]);
								renderApp(
									data.caller,
									newCredentials,
									campaignAvailable,
									newPrefered ? newPrefered : campaignAvailable[0]
								);
							}
						} else {
							const newPreferred = campaignAvailable.find(el => el.callPermited);
							setPreferredCampaign(newPreferred ? newPreferred : campaignAvailable[0]);
							renderApp(
								data.caller,
								newCredentials,
								campaignAvailable,
								newPreferred ? newPreferred : campaignAvailable[0]
							);
						}
					} else {
						setErrorMessage('Erreur de connexion');
					}
				} else {
					if (response?.status == 500) {
						setErrorMessage('Une erreur serveur est survenue');
					} else if (response.data.message == 'Invalid credential') {
						setErrorMessage('Identifiant ou mot de passe incorrect');
					} else {
						setErrorMessage(response?.data?.Message ?? 'error');
					}
				}
			})
			.catch(err => {
				if (err.response?.data?.message) {
					setErrorMessage(err.response.data.message);
				} else {
					setErrorMessage('Une erreur est survenue');
				}
				console.error(err);
			})
			.finally(() => setLoading(false));
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
				Pas de compte ? <Link to="/NewAccount">Par ici !</Link>
			</div>
			{ErrorMessage ?? <></>}
			{Loading ? <Loader /> : <></>}
		</div>
	);
}

function CreateAccount() {
	const [Loading, setLoading] = useState(false);
	const [ErrorMessage, setErrorMessage] = useState<string | null>(null);

	const navigate = useNavigate();

	function next(e: React.KeyboardEvent<HTMLInputElement>, id: string) {
		if (e.key === 'Enter') {
			document.getElementById(id)?.focus();
		}
	}

	function CreateAccount(credentials: {
		phone: string;
		pinCode: string;
		CallerName: string;
		campaignPassword: string;
	}) {
		setLoading(true);
		setErrorMessage(null);

		axios
			.post(ApiUrl + '/caller/createCaller', credentials)
			.then(res => {
				setLoading(false);
				if (res.status == 200 && res.data.data) {
					setPreferredCampaign(parseCampaign([res.data.data.campaign])[0]);
					navigate('/');
				} else {
					setErrorMessage('Une erreur est survenue');
				}
			})
			.catch(err => {
				if (err.response?.data?.message) {
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

	return (
		<div className="LoginPageMain">
			<h1>Nouveau compte</h1>
			<form
				onSubmit={e => {
					e.preventDefault();
					CreateAccount({
						phone: e.currentTarget.phone.value,
						pinCode: e.currentTarget.pin.value,
						CallerName: e.currentTarget.firstname.value,
						campaignPassword: e.currentTarget.password.value
					});
				}}
			>
				<input
					className="inputField"
					id="password"
					type="password"
					placeholder="Clé d'organisation"
					onKeyUp={e => next(e, 'firstname')}
				/>
				<input
					className="inputField"
					id="firstname"
					type="text"
					placeholder="Nom"
					onKeyUp={e => next(e, 'phone')}
				/>
				<input
					className="inputField"
					id="phone"
					type="tel"
					placeholder="Téléphone"
					onKeyUp={e => next(e, 'pin')}
				/>
				<input
					className="inputField"
					id="pin"
					type="tel"
					placeholder="Pin"
					maxLength={4}
					onKeyUp={e => {
						if (e.key === 'Enter') {
							e.currentTarget.form?.requestSubmit();
						}
					}}
				/>

				<Button value="Créer un compte" isSubmit />
			</form>
			<div className="NoAccount">
				Déjà un compte ?<Link to="/">Par ici !</Link>
			</div>
			{ErrorMessage ?? ''}
			{Loading ? <Loader /> : <></>}
		</div>
	);
}
function LoginPage({
	renderApp
}: {
	renderApp: (caller: Caller, credentials: CredentialsV2, campaigns: Array<Campaign>, campaign: Campaign) => void;
}) {
	return (
		<HashRouter>
			<div className="LoginPage">
				<Routes>
					<Route path="/NewAccount" element={<CreateAccount />} />
					<Route path="/*" element={<LoginBoard renderApp={renderApp} />} />
				</Routes>
				<Footer />
			</div>
		</HashRouter>
	);
}

export default LoginPage;
