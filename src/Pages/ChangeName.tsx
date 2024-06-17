import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Components/Button';

function ChangeName({
	credentials,
	caller,
	setCaller
}: {
	credentials: Credentials;
	caller: Caller;
	setCaller: (caller: Caller) => void;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Changer');

	const navigate = useNavigate();

	function modify(name: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/changeName', {
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					area: credentials.area,
					newName: name
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

		const name = (document.getElementById('firstname') as HTMLInputElement).value;
		modify(name).then(res => {
			if (res) {
				caller.name = name;
				setCaller(caller);
				navigate('/Settings');
			} else {
				setButtonValue('Une erreur est survenue');
			}
			setButtonDisabled(false);
		});
	}

	function enter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			click();
		}
	}

	function change() {
		if (ButtonValue === 'Changer') return;
		setButtonValue('Changer');
	}

	return (
		<div className="Dashboard">
			<h1>Changement de nom</h1>
			<input
				className="inputField"
				type="text"
				id="firstname"
				defaultValue={caller.name}
				placeholder="Nouveau nom"
				onKeyUp={enter}
				onChange={change}
			/>
			<Button value={ButtonValue} onclick={click} type={ButtonDisabled ? 'ButtonDisabled' : ''} />
		</div>
	);
}

export default ChangeName;
