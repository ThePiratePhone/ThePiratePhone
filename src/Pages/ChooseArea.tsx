import { useEffect } from 'react';
import Button from '../Components/Button';

function ChooseArea({ renderApp, areas }: { renderApp: (area: Campaign) => void; areas: Array<Campaign> }) {
	areas = areas.sort((a, b) => {
		if (a.areaName > b.areaName) {
			return 1;
		} else if (a.areaName < b.areaName) {
			return -1;
		}
		return 0;
	});

	useEffect(() => {
		if ((window.localStorage.getItem('credentials') as string) != null) {
			const credentials: Credentials = JSON.parse(window.localStorage.getItem('credentials') as string);
			const area = areas.find(area => area.areaId === credentials.area);
			if (area !== undefined) {
				renderApp(area);
			}
		}
	}, [renderApp, areas]);

	if (areas.length === 0) {
		window.localStorage.removeItem('credentials');
	}

	function click() {
		const areaId = (document.getElementById('area') as HTMLInputElement).value;
		const area = areas.find(val => val.areaId === areaId) as Campaign;
		renderApp(area);
	}

	return (
		<div className="LoginPage">
			<div className="LoginPageMain">
				<h1>Choisissez votre organisation</h1>
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
			</div>
		</div>
	);
}

export default ChooseArea;
