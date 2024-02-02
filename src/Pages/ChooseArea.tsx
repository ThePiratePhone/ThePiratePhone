import { useEffect } from 'react';

function ChooseArea({ renderApp, areas }: { renderApp: (area: AreaCombo) => void; areas: Array<AreaCombo> }) {
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

	return (
		<div className="LoginPage">
			<div className="LoginPageMain">
				<h1>Choisissez votre organisation</h1>
				{areas.map((area, i) => {
					return (
						<div className="AreaLogin" key={i} onClick={() => renderApp(area)}>
							{area.areaName}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default ChooseArea;
