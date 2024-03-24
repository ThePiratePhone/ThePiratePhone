import { useState } from 'react';
import { Link } from 'react-router-dom';

import Logo from '../Assets/Logo.svg';

function Header({ areaName }: { areaName: string }) {
	const [isNavExpanded, setIsNavExpanded] = useState(false);

	const LINKS = [
		{ value: 'Accueil', link: '/' },
		{ value: 'Appeler', link: '/Calling' },
		{ value: 'ScoreBoard', link: '/ScoreBoard' },
		{ value: "Changer d'organisation", link: '/Switch' },
		{ value: 'Paramètres', link: '/Settings' }
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

				<svg
					width="64"
					height="64"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="MenuIcon"
					onClick={() => setIsNavExpanded(!isNavExpanded)}
				>
					{isNavExpanded ? <path d="M20 20L4 4m16 0L4 20" /> : <path d="M5 6h14M5 12h14M5 18h14" />}
				</svg>
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
