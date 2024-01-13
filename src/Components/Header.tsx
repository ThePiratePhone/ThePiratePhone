import { Link } from 'react-router-dom';

import Logo from '../Assets/Logo.png';

import NavButton from './Button';

function Header({ caller }: { caller: Caller }) {
	return (
		<div className="Header">
			<Link to="/" className="Logo">
				<img src={Logo} alt="Logo" />
			</Link>
			<NavButton link="about" value="A propos" />
			<NavButton link="account" value={caller.name} />
		</div>
	);
}

export default Header;
