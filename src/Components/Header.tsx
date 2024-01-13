import { Link } from 'react-router-dom';

import Logo from '../Assets/Logo.svg';

import NavButton from './Button';

function Header({ caller }: { caller: Caller }) {
	return (
		<div className="Header">
			<Link to="/">
				<img src={Logo} alt="Logo" className="Logo" />
			</Link>
			<NavButton link="about" name="A propos" />
			<NavButton link="account" name={caller.name} />
		</div>
	);
}

export default Header;
