import { Link } from 'react-router-dom';

function NavButton({ value, link, image }: { value: string; link: string; image?: string }) {
	return (
		<Link className="NavButton" to={'/' + link}>
			<button>
				{image ? <img className="ButtonIcon" src={image} /> : <></>}
				{value}
			</button>
		</Link>
	);
}

export default NavButton;
