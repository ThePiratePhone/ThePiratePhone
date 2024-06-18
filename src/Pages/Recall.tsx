import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Components/Button';
import Loader from '../Components/Loader';

function Recall({ credentials }: { credentials: Credentials }) {
	const VALUES = [
		{ name: 'Compte voter', value: 2 },
		{ name: 'Ne compte pas voter', value: 1 },
		{ name: 'Pas interessé·e', value: -1 },
		{ name: 'À retirer', value: -2 }
	];

	const navigate = useNavigate();
	const [Loading, setLoading] = useState(false);
	const [ErrorMessage, setErrorMessage] = useState<string | null>(null);

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
					} else if (err.response.data.message == 'Client not found') {
						resolve(2);
					} else {
						console.error(err);
						resolve(-1);
					}
				});
		});
	}

	function click() {
		setLoading(true);

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
				setErrorMessage("Vous n'avez pas appelé ce contact");
			} else if (res == 2) {
				setErrorMessage('Contact non trouvé');
			} else {
				setErrorMessage('Une erreur est survenue');
			}
			setLoading(false);
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
				<Button value="Confirmer" onclick={click} />
			</div>
			{ErrorMessage ?? ''}
			{Loading ? <Loader /> : <></>}
		</div>
	);
}

export default Recall;
