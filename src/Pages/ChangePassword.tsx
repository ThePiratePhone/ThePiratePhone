import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Components/Button';
import Loader from '../Components/Loader';

function ChangePassword({
	credentials,
	setCredentials
}: {
	credentials: CredentialsV2;
	setCredentials: (credentials: CredentialsV2) => void;
}) {
	const [Loading, setLoading] = useState(false);

	const navigate = useNavigate();

	async function modify(pinCode: string) {
		try {
			await axios.post(credentials.URL + '/caller/changePassword', {
				phone: credentials.phone,
				pinCode: credentials.pinCode,
				campaign: credentials.campaign,
				newPin: pinCode
			});
			return true;
		} catch (err: any) {
			console.error(err);
			return false;
		}
	}

	function click() {
		setLoading(true);

		const pin = (document.getElementById('pin') as HTMLInputElement).value;
		modify(pin).then(res => {
			if (res) {
				credentials.pinCode = pin;
				setCredentials(credentials);
				navigate('/Settings');
			}
			setLoading(false);
		});
	}

	function enter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			click();
		}
	}

	return (
		<div className="Dashboard">
			<h1>Changement de pin</h1>
			<input maxLength={4} className="inputField" type="tel" id="pin" placeholder="Nouveau pin" onKeyUp={enter} />
			<Button value="Changer" onclick={click} />
			{Loading ? <Loader /> : <></>}
		</div>
	);
}

export default ChangePassword;
