import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';

const URL = 'https://cs.mpqa.fr:7000/api';

function ChangePassword({
	credentials,
	setCredentials
}: {
	credentials: Credentials;
	setCredentials: (credentials: Credentials) => void;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Modifier');

	const navigate = useNavigate();

	function modify(pinCode: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(URL + '/changePassword', {
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					area: credentials.area,
					newPin: pinCode
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
		if (ButtonDisabled) return;

		setButtonDisabled(true);
		setButtonValue('Vérification...');

		const pin = (document.getElementById('pin') as HTMLInputElement).value;
		modify(pin).then(res => {
			if (res) {
				credentials.pinCode = pin;
				setCredentials(credentials);
				navigate('/Settings');
			} else {
				setButtonValue('Une erreur est survenue');
			}
			setButtonDisabled(false);
		});
	}

	function enter(e: any) {
		if (e.key === 'Enter') {
			click();
		}
	}

	function change() {
		if (ButtonValue === 'Modifier') return;
		setButtonValue('Modifier');
	}

	return (
		<div className="Dashboard">
			<h1>Changement de pin</h1>
			<input
				maxLength={4}
				className="inputField"
				type="tel"
				id="pin"
				placeholder="Nouveau pin"
				onKeyUp={enter}
				onChange={change}
			/>
			<Button value={ButtonValue} onclick={click} type={ButtonDisabled ? 'ButtonDisabled' : ''} />
		</div>
	);
}

export default ChangePassword;
