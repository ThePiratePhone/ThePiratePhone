import { useNavigate } from 'react-router-dom';

import NavButton from '../Components/Button';
import { cleanNumber } from '../Utils';

function Account({ caller, renderLogin }: { caller: Caller; renderLogin: () => void }) {
	const navigate = useNavigate();

	function logOut() {
		window.localStorage.removeItem('credentials');
		navigate('/', { replace: true });
		renderLogin();
	}

	return (
		<div className="AccountPage">
			<h1>Mon compte</h1>
			<div>
				Nom: <b>{caller.name}</b>
			</div>
			<div>
				Numéro: <b>{cleanNumber(caller.phone)}</b>
			</div>
			<div>
				Pin: <b>{caller.pinCode}</b>
			</div>
			<NavButton value="Se déconnecter" onclick={logOut} />
		</div>
	);
}

export default Account;
