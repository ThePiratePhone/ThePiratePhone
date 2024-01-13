import { Link } from 'react-router-dom';

function NavButton({ value, link }: { value: string; link: string }) {
	return (
		<Link className="NavButton" to={'/' + link}>
			<button>{value}</button>
		</Link>
	);
}

export default NavButton;
