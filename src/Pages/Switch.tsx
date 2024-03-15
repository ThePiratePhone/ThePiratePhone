import { Link, useNavigate } from 'react-router-dom';
import Button from '../Components/Button';

function Switch({
	areas,
	setCredentials,
	switchArea,
	credentials
}: {
	areas: Array<Campaign>;
	setCredentials: (newCredentials: Credentials) => void;
	switchArea: (area: Campaign) => void;
	credentials: Credentials;
}) {
	const navigate = useNavigate();

	function click() {
		const areaId = (document.getElementById('area') as HTMLInputElement).value;
		credentials.area = areaId;
		const area = areas.find(val => val.areaId === areaId) as Campaign;
		setCredentials(credentials);
		switchArea(area);
		navigate('/');
	}
	return (
		<div className="Dashboard">
			<h1>Changer d'organisation</h1>
			<select className="inputField" id="area">
				{areas.map((area, i) => {
					return (
						<option key={i} value={area.areaId}>
							{area.areaName}
						</option>
					);
				})}
			</select>
			<Button value="Valider" onclick={click} />

			<Link to="/Join" className="JoinArea">
				L'organisation n'apparait pas ? Rejoignez-là <u>ici</u>.
			</Link>
		</div>
	);
}

export default Switch;
