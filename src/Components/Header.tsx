import { useState } from 'react';
import { Link } from 'react-router-dom';

import Burger from '../Assets/Burger.svg';
import Cross from '../Assets/Cross.svg';
import Logo from '../Assets/Logo.svg';

function Header({ areaName }: { areaName: string }) {
	const [isNavExpanded, setIsNavExpanded] = useState(false);

	const LINKS = [
		{ value: 'Accueil', link: '/' },
		{ value: 'Appeler', link: '/Calling' },
		{ value: "Changer d'organisation", link: '/Switch' },
		{ value: 'Mon compte', link: '/Account' }
	];

	return (
		<>
			<div className="Header">
				<Link to="/" className="Logo" onClick={() => setIsNavExpanded(false)}>
					<img className="Logo" src={Logo} alt="Logo" />
				</Link>
				<Link to="/Switch" className="AreaName" onClick={() => setIsNavExpanded(false)}>
					{areaName}
				</Link>
				<img
					onClick={() => {
						setIsNavExpanded(!isNavExpanded);
					}}
					src={isNavExpanded ? Cross : Burger}
					alt="Navigation menu"
					className="MenuIcon"
				/>
			</div>
			<div className={isNavExpanded ? 'NavMenu expanded' : 'NavMenu'} onClick={() => setIsNavExpanded(false)}>
				{LINKS.map((val, i) => {
					return (
						<Link className="NavMenuButton" to={val.link} key={i}>
							{val.value}
						</Link>
					);
				})}
			</div>
		</>
	);
}

export default Header;
