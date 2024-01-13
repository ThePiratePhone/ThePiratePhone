import axios from 'axios';
import { useEffect, useState } from 'react';

const URL = 'https://dfg.freeboxos.fr:7000/api';

function Login(credentials: { number: string; pin: string }): Promise<LoginResponse> {
	return new Promise(resolve => {
		axios
			.post(`${URL}/login`, { number: credentials.number, pin: credentials.pin })
			.catch(() => {
				resolve({ OK: false, Message: 'Unknown error', data: undefined });
			})
			.then(response => {
				if (typeof response == 'undefined') {
					resolve({ OK: false, Message: 'Unknown error', data: undefined });
				} else {
					resolve({ OK: true, Message: 'OK', data: response.data });
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

function LoginPage({ render }: { render: (caller: Caller) => void }) {
	const [ButtonEnabled, setButtonEnabled] = useState(false);

	useEffect(() => {
		if (window.localStorage.getItem('credentials') == null) {
			testOldToken().then(result => {
				if (result.OK && result.data) return render(result.data);
				setButtonEnabled(true);
			});
		}
	});

	useEffect(() => {
		const phone = document.getElementById('phone') as HTMLInputElement;
		const pin = document.getElementById('pin') as HTMLInputElement;
		if (ButtonEnabled) {
			phone.disabled = false;
			pin.disabled = false;
		} else {
			phone.disabled = true;
			pin.disabled = true;
		}
	}, [ButtonEnabled]);

	function click() {
		setButtonEnabled(false);
		const credentials = {
			number: (document.getElementById('phone') as HTMLInputElement).value,
			pin: (document.getElementById('pin') as HTMLInputElement).value as string
		};
		Login(credentials).then(result => {
			if (result.OK && result.data) {
				window.localStorage.setItem('credentials', JSON.stringify(credentials));
				render(result.data);
			} else {
				setButtonEnabled(true);
			}
		});
	}

	return (
		<div className="LoginPage">
			<h1>Bienvenue sur Call Sphere</h1>
			<div>
				<div>
					<label htmlFor="phone">Numéro de téléphone</label>
					<input id="phone" type="tel" />
				</div>
				<div>
					<label htmlFor="pin">Code pin</label>
					<input id="pin" type="password" />
				</div>
			</div>
			<div className="NavButton">
				<button onClick={click} className={ButtonEnabled ? '' : 'ButtonDisabled'}>
					Se connecter
				</button>
			</div>
		</div>
	);
}

export default LoginPage;
