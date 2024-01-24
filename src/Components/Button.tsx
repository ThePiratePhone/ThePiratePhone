import { Link } from 'react-router-dom';

function NavButton({
	value,
	link,
	image,
	onclick
}: {
	value: string;
	link?: string;
	image?: string;
	onclick?: () => void;
}) {
	if (link) {
		return (
			<Link className="NavButton" to={link} onClick={onclick}>
				<button>
					{image ? <img className="ButtonIcon" src={image} alt="Button" /> : <></>}
					{value}
				</button>
			</Link>
		);
	} else {
		return (
			<div className="NavButton" onClick={onclick}>
				<button>
					{image ? <img className="ButtonIcon" src={image} alt="Button" /> : <></>}
					{value}
				</button>
			</div>
		);
	}
}

export default NavButton;
