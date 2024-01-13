import { Link } from 'react-router-dom';

function NavButton({ name, link }: { name: string; link: string }) {
	return (
		<Link className="NavButton" to={'/' + link}>
			<button>{name}</button>
		</Link>
	);
}

export default NavButton;
