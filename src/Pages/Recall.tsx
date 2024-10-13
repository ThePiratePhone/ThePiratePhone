import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Components/Button';
import Loader from '../Components/Loader';

function Recall({ status, credentials }: { status: Array<string>; credentials: Credentials }) {
	const navigate = useNavigate();
	const [Loading, setLoading] = useState(false);
	const [ErrorMessage, setErrorMessage] = useState<string | null>(null);

	async function post(satisfaction: string, phone: string, recall: boolean, comment?: string) {
		try {
			return (
				await axios.post(credentials.URL + '/caller/validateCall', {
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					area: credentials.area,
					satisfaction: satisfaction,
					status: recall,
					phoneNumber: phone,
					comment: comment
				})
			).data.OK
				? 0
				: -1;
		} catch (err: any) {
			if (err.response.data.message == 'you dont call this client') {
				return 1;
			} else if (err.response.data.message == 'Client not found') {
				return 2;
			} else {
				console.error(err);
				return -1;
			}
		}
	}

	function click() {
		setLoading(true);

		const satisfaction = (document.getElementById('satisfaction') as HTMLInputElement).value;
		const phone = (document.getElementById('phone') as HTMLInputElement).value;
		let comment: string | undefined = (document.getElementById('comment') as HTMLInputElement).value.trim();
		const recall = (document.getElementById('recall') as HTMLInputElement).checked;

		if (comment === '') {
			comment = undefined;
		}

		post(satisfaction, phone, recall, comment).then(res => {
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
					{status.map((value, i) => {
						return <option key={i}>{value}</option>;
					})}
				</select>
				<div>
					<input type="checkbox" className="recall" id="recall" />
					<label htmlFor="recall">À rappeler</label>
				</div>
				<textarea className="inputField comment" placeholder="Commentaire" id="comment"></textarea>
				<Button value="Confirmer" onclick={click} />
			</div>
			{ErrorMessage ?? ''}
			{Loading ? <Loader /> : <></>}
		</div>
	);
}

export default Recall;
