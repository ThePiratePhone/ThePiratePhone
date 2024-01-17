import { Link } from 'react-router-dom';

import Logo from '../Assets/Logo.png';
import Phone from '../Assets/Phone.svg';

import NavButton from './Button';

function CallerIcon({ caller }: { caller: Caller }) {
	return (
		<div>
			<NavButton link="account" value={caller.name} />
		</div>
	);
}

function Header({ caller }: { caller: Caller }) {
	return (
		<div className="Header">
			<Link to="/" className="Logo">
				<img src={Logo} alt="Logo" />
			</Link>
			<NavButton link="calling" value="Appeler" image={Phone} />
			<NavButton link="about" value="A propos" />
			<CallerIcon caller={caller} />
		</div>
	);
}

export default Header;
