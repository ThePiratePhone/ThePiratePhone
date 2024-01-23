import { useState } from 'react';
import { Link } from 'react-router-dom';

import Logo from '../Assets/Logo.svg';
import Phone from '../Assets/Phone.svg';
import Burger from '../Assets/Burger.svg';

import { mobileCheck } from '../Utils';
import NavButton from './Button';

function DesktopHeader({ caller }: { caller: Caller }) {
	return (
		<div className="Header">
			<Link to="/" className="Logo">
				<img src={Logo} alt="Logo" />
			</Link>
			<NavButton link="calling" value="Appeler" image={Phone} />
			<NavButton link="account" value={caller.name} />
		</div>
	);
}

function MobileHeader({ caller }: { caller: Caller }) {
	const [isNavExpanded, setIsNavExpanded] = useState(false);

	return (
		<>
			<div className="MobileHeader">
				<div className="MobileLogo">
					<img src={Logo} alt="Logo" />
				</div>
				<img
					onClick={() => {
						setIsNavExpanded(!isNavExpanded);
					}}
					src={Burger}
					alt="Burger Menu"
					className="BurgerIcon"
				/>
			</div>
			<div className={isNavExpanded ? 'NavMenu expanded' : 'NavMenu'}>
				<NavButton link="" value="Accueil" onclick={() => setIsNavExpanded(false)} />
				<NavButton link="calling" value="Appeler" image={Phone} onclick={() => setIsNavExpanded(false)} />
				<NavButton link="account" value={caller.name} onclick={() => setIsNavExpanded(false)} />
			</div>
		</>
	);
}

function Header({ caller }: { caller: Caller }) {
	return mobileCheck() ? <MobileHeader caller={caller} /> : <DesktopHeader caller={caller} />;
}

export default Header;
