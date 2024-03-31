import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Button from '../Components/Button';

function Recall({ credentials }: { credentials: Credentials }) {
	const VALUES = [
		{ name: 'Voté pour nous', value: 2 },
		{ name: 'Pas voté pour nous', value: 1 },
		{ name: 'Pas interessé·e', value: -1 },
		{ name: 'À retirer', value: -2 }
	];

	const navigate = useNavigate();

	function post(satisfaction: number, phone: string, comment?: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/validatePhone', {
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					area: credentials.area,
					satisfaction: satisfaction,
					phoneNumber: phone,
					comment: comment
				})
				.then(() => {
					resolve(true);
				})
				.catch(err => {
					console.error(err);
					resolve(false);
				});
		});
	}

	function click() {
		const satisfaction = parseInt((document.getElementById('satisfaction') as HTMLInputElement).value);
		const phone = (document.getElementById('phone') as HTMLInputElement).value;
		let comment: string | undefined = (document.getElementById('comment') as HTMLInputElement).value.trim();

		if (comment === '') {
			comment = undefined;
		}

		post(satisfaction, phone, comment).then(res => {
			if (res) {
				navigate('/');
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
				<Button value="Confirmer" onclick={click} />
			</div>
		</div>
	);
}

export default Recall;
