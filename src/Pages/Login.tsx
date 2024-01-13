import axios from 'axios';
import { useEffect, useState } from 'react';

function Login(credentials: { number: string; pin: string }): Promise<LoginResponse> {
	return new Promise(resolve => {
		axios
			.post(`${process.env.URL}/loginUser`, { number: credentials.number, pin: credentials.pin })
			.catch((err: Error) => {
				console.error(err);
				resolve({ OK: false, Message: err.message });
			})
			.then(response => {
				if (typeof response == 'undefined') {
					resolve({ OK: false, Message: 'Unknown error' });
				} else {
					resolve({ OK: true, Message: 'OK' });
				}
			});
	});
}

async function testOldToken(): Promise<boolean> {
	return new Promise(resolve => {
		const oldCredentials = window.localStorage.getItem('credentials');
		if (oldCredentials == null) resolve(false);
		console.log(oldCredentials);
		Login(JSON.parse(oldCredentials as string))
			.then(result => {
				if (result.OK) {
					resolve(true);
				} else {
					resolve(false);
				}
			})
			.catch(() => resolve(false));
	});
}

function LoginPage({ render }: { render: Function }) {
	const [ButtonEnabled, setButtonEnabled] = useState(false);

	useEffect(() => {
		testOldToken().then(result => {
			if (result) return render();
			setButtonEnabled(true);
		});
	}, [setButtonEnabled]);

	function click() {
		setButtonEnabled(false);
		const credentials = {
			number: (document.getElementById('phone') as HTMLInputElement).value,
			pin: (document.getElementById('pin') as HTMLInputElement).value as string
		};
		Login(credentials).then(result => {
			if (result.OK) {
				window.localStorage.setItem('credentials', JSON.stringify(credentials));
				render();
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
