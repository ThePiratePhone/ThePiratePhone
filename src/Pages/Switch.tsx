import { useNavigate } from 'react-router-dom';

function Switch({
	areas,
	setCredentials,
	switchArea,
	credentials
}: {
	areas: Array<AreaCombo>;
	setCredentials: (newCredentials: Credentials) => void;
	switchArea: (area: AreaCombo) => void;
	credentials: Credentials;
}) {
	const navigate = useNavigate();

	function click() {
		const areaId = (document.getElementById('area') as HTMLInputElement).value;
		credentials.area = areaId;
		const area = areas.find(val => val.areaId === areaId) as AreaCombo;
		setCredentials(credentials);
		switchArea(area);
		navigate('/');
	}
	return (
		<div className="Dashboard">
			<h1>Changer d'organisation</h1>
			<select className="JoinSelect" id="area">
				{areas.map((area, i) => {
					return (
						<option key={i} value={area.areaId}>
							{area.areaName}
						</option>
					);
				})}
			</select>
			<div className="NavButton" onClick={click}>
				<button>Valider</button>
			</div>
		</div>
	);
}

export default Switch;
