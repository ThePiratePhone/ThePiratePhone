import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Components/Button';
import Loader from '../Components/Loader';
import { setPreferredCampaign } from '../Utils/Storage';

function Join({
	credentials,
	setCredentials,
	addCampaign,
	next
}: {
	credentials: CredentialsV2;
	setCredentials: (newCredentials: CredentialsV2) => void;
	addCampaign: (newCampaign: Campaign) => void;
	next?: () => void;
}) {
	const navigate = useNavigate();
	const [Loading, setLoading] = useState(false);
	const [ErrorMessage, setErrorMessage] = useState<string | null>(null);
	const [ButtonDisabled, setButtonDisabled] = useState(true);

	async function join(password: string): Promise<Campaign | undefined> {
		try {
			const res = await axios.post(credentials.URL + '/caller/joinCampaign', {
				phone: credentials.phone,
				pinCode: credentials.pinCode,
				campaignPassword: password
			});
			return res.data?.data?.campaign;
		} catch (err: any) {
			if (err.response.data.message === 'Campaign not found') {
				setErrorMessage("Clé invalide, ou aucune campagne dans l'organisation");
			} else if (err.response.data.message === 'Already joined campaign') {
				setErrorMessage('Vous avez déjà rejoint cette campagne');
			} else {
				console.error(err);
				setErrorMessage('Une erreur est survenue');
			}
			setLoading(false);
			return undefined;
		}
	}

	function enter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			click();
		}
	}

	function click() {
		if (Loading) return;

		const password = (document.getElementById('password') as HTMLInputElement).value;

		setLoading(true);

		join(password).then(newCampaign => {
			if (newCampaign) {
				credentials.campaign = newCampaign._id;
				setCredentials(credentials);
				setPreferredCampaign(newCampaign);
				addCampaign(newCampaign);
				next ? next() : navigate('/');
			}
		});
	}

	return (
		<div className="Dashboard">
			<h1>Rejoindre une organisation</h1>
			<p>
				Vous pouvez rejoindre une organisation en entrant sa clé d'organisation. Si vous ne la connaissez pas,
				l'administrateur de l'organisation devrait pouvoir vous la fournir.
			</p>
			<input
				className="inputField"
				id="password"
				type="password"
				placeholder="Clé d'organisation"
				onChange={e => {
					setButtonDisabled(e.target.value.trim() === '');
					setErrorMessage(null);
				}}
				onKeyUp={enter}
			/>
			{ErrorMessage ?? ''}
			<Button type={ButtonDisabled ? 'ButtonDisabled' : undefined} value="Rejoindre" onclick={click} />
			{Loading ? <Loader /> : <></>}
		</div>
	);
}

export default Join;
