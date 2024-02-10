import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URL = 'https://cs.mpqa.fr:7000/api';

function Recall({ credentials }: { credentials: Credentials }) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [State, setState] = useState('');

	const navigate = useNavigate();

	function send(satisfaction: number, phone: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(URL + '/validatePhoneNumber', {
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					area: credentials.area,
					satisfaction: satisfaction,
					phoneNumber: phone
				})
				.then(res => {
					console.log(res);
					resolve(true);
				})
				.catch(err => {
					console.error(err);
					resolve(false);
				});
		});
	}

	function click(satisfaction: number) {
		if (ButtonDisabled) return;

		setButtonDisabled(true);
		setState('Vérification...');

		const phone = (document.getElementById('phone') as HTMLInputElement).value.replaceAll(' ', '');

		send(satisfaction, phone).then(value => {
			if (value) {
				setState('Enregistré !');
				setTimeout(() => {
					navigate('/');
				}, 3000);
			} else {
				setState('Mauvais numéro de téléphone');
				setButtonDisabled(false);
			}
		});
	}

	return (
		<div className="Dashboard">
			<h1>Rappel</h1>
			<input disabled={ButtonDisabled} className="inputField" id="phone" type="tel" placeholder="Téléphone" />
			<div className="CallingButtons">
				<div className={ButtonDisabled ? 'NavButton ButtonDisabled' : 'NavButton'}>
					<button disabled={ButtonDisabled} onClick={() => click(2)}>
						Voté pour nous
					</button>
				</div>
				<div className={ButtonDisabled ? 'NavButton ButtonDisabled' : 'NavButton'}>
					<button disabled={ButtonDisabled} onClick={() => click(1)}>
						Pas voté pour nous
					</button>
				</div>
				<div className={ButtonDisabled ? 'NavButton ButtonDisabled' : 'NavButton'}>
					<button disabled={ButtonDisabled} onClick={() => click(-1)}>
						Pas interessé
					</button>
				</div>
				<div className={ButtonDisabled ? 'NavButton RedButton ButtonDisabled' : 'NavButton RedButton'}>
					<button disabled={ButtonDisabled} onClick={() => click(-2)}>
						A retirer
					</button>
				</div>
			</div>
			<h2>{State}</h2>
		</div>
	);
}

export default Recall;
