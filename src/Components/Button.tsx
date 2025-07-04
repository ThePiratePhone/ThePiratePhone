import { Link } from 'react-router-dom';

function Button({
	value,
	link,
	isSubmit = false,
	type,
	onclick
}: {
	value: string;
	type?: '' | 'RedButton' | 'ButtonDisabled';
	isSubmit?: boolean;
	link?: string;
	onclick?: () => void;
}) {
	if (link) {
		return (
			<Link className={type !== '' ? 'Button ' + type : 'Button'} to={link} onClick={onclick}>
				<button type={isSubmit ? 'submit' : 'button'}>{value}</button>
			</Link>
		);
	} else {
		return (
			<div className={type ? 'Button ' + type : 'Button'} onClick={onclick}>
				<button type={isSubmit ? 'submit' : 'button'}>{value}</button>
			</div>
		);
	}
}

export default Button;
