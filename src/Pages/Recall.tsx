import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import Button from '../Components/Button';

function Recall({ credentials }: { credentials: Credentials }) {
	const VALUES = [
		{ name: 'Voté pour nous', value: 2 },
		{ name: 'Pas voté pour nous', value: 1 },
		{ name: 'Pas interessé·e', value: -1 },
		{ name: 'À retirer', value: -2 }
	];

	const navigate = useNavigate();
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Confirmer');

	function post(satisfaction: number, phone: string, comment?: string) {
		return new Promise<number>(resolve => {
			axios
				.post(credentials.URL + '/validatePhoneNumber', {
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					area: credentials.area,
					satisfaction: satisfaction,
					phoneNumber: phone,
					comment: comment
				})
				.then(res => {
					if (res.data.OK) {
						resolve(0);
					} else {
						resolve(-1);
					}
				})
				.catch(err => {
					if (err.response.data.message == 'you dont call this client') {
						resolve(1);
					} else {
						console.error(err);
						resolve(-1);
					}
				});
		});
	}

	function click() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification en cours...');
		const satisfaction = parseInt((document.getElementById('satisfaction') as HTMLInputElement).value);
		const phone = (document.getElementById('phone') as HTMLInputElement).value;
		let comment: string | undefined = (document.getElementById('comment') as HTMLInputElement).value.trim();

		if (comment === '') {
			comment = undefined;
		}

		post(satisfaction, phone, comment).then(res => {
			if (res == 0) {
				navigate('/');
			} else if (res == 1) {
				setButtonDisabled(false);
				setButtonValue("Vous n'avez pas appelé ce contact");
			} else {
				setButtonDisabled(false);
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	return (
		<div className="Dashboard">
			<h1>Rappel</h1>
			<input className="inputField" id="phone" type="tel" placeholder="Téléphone" />
			<div className="CallingButtons">
				<select className="inputField" id="satisfaction">
					{VALUES.map((value, i) => {
						return (
							<option key={i} value={value.value}>
								{value.name}
							</option>
						);
					})}
				</select>
				<textarea className="inputField comment" placeholder="Commentaire" id="comment"></textarea>
				<Button value={ButtonValue} type={ButtonDisabled ? 'ButtonDisabled' : undefined} onclick={click} />
			</div>
		</div>
	);
}

export default Recall;
