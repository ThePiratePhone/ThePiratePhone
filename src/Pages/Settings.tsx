import { useNavigate } from 'react-router-dom';

import Button from '../Components/Button';
import { cleanNumber } from '../Utils';

function Settings({ caller, renderLogin }: { caller: Caller; renderLogin: () => void }) {
	const navigate = useNavigate();

	function logOut() {
		window.localStorage.removeItem('credentials');
		navigate('/');
		renderLogin();
	}

	return (
		<div className="SettingsPage">
			<h1>Paramètres</h1>
			<div>
				Nom: <b>{caller.name}</b>
			</div>
			<div>
				Numéro: <b className="Phone">{cleanNumber(caller.phone)}</b>
			</div>
			<div>
				Pin: <b className="Phone">{caller.pinCode}</b>
			</div>
			<Button value="Changer le theme" link="/ChangeTheme" />
			<Button value="Changer votre nom" link="/ChangeName" />
			<Button value="Changer votre pin" link="/ChangePassword" />
			<Button value="Se déconnecter" type="RedButton" onclick={logOut} />
		</div>
	);
}

export default Settings;
