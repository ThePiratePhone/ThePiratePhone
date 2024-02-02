import { useState } from 'react';
import { Link } from 'react-router-dom';

import Burger from '../Assets/Burger.svg';
import Logo from '../Assets/Logo.svg';

import NavButton from './Button';

function DesktopHeader() {
	return (
		<div className="Header">
			<Link to="" className="Logo">
				<img src={Logo} alt="Logo" />
			</Link>
			<NavButton link="Calling" value="Appeler" />
			<NavButton link="Account" value="Mon compte" />
		</div>
	);
}

function MobileHeader() {
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
			<div className={isNavExpanded ? 'NavMenu expanded' : 'NavMenu'} onClick={() => setIsNavExpanded(false)}>
				<NavButton link="/" value="Accueil" />
				<NavButton link="Calling" value="Appeler" />
				<NavButton link="Join" value="Joindre une organisation" />
				<NavButton link="Account" value="Mon compte" />
			</div>
		</>
	);
}

function Header({ isMobile }: { isMobile: boolean }) {
	return isMobile ? <MobileHeader /> : <DesktopHeader />;
}

export default Header;
