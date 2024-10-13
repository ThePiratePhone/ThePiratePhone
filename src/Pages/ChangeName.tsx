import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Components/Button';
import Loader from '../Components/Loader';

function ChangeName({
	credentials,
	caller,
	setCaller
}: {
	credentials: Credentials;
	caller: Caller;
	setCaller: (caller: Caller) => void;
}) {
	const [Loading, setLoading] = useState(false);

	const navigate = useNavigate();

	async function modify(name: string) {
		try {
			await axios.post(credentials.URL + '/caller/changeName', {
				phone: credentials.phone,
				pinCode: credentials.pinCode,
				area: credentials.area,
				newName: name
			});
			return true;
		} catch (err: any) {
			console.error(err);
			return false;
		}
	}

	function click() {
		setLoading(true);
		const name = (document.getElementById('firstname') as HTMLInputElement).value;
		modify(name).then(res => {
			if (res) {
				caller.name = name;
				setCaller(caller);
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
			<h1>Changement de nom</h1>
			<input
				className="inputField"
				type="text"
				id="firstname"
				defaultValue={caller.name}
				placeholder="Nouveau nom"
				onKeyUp={enter}
			/>
			<Button value="Changer" onclick={click} />
			{Loading ? <Loader /> : <></>}
		</div>
	);
}

export default ChangeName;
