import { useEffect } from 'react';

function ChooseArea({ renderApp, areas }: { renderApp: (area: string) => void; areas: Array<AreaCombo> }) {
	areas = areas.sort((a, b) => {
		if (a.areaName > b.areaName) {
			return 1;
		} else if (a.areaName < b.areaName) {
			return -1;
		}
		return 0;
	});

	useEffect(() => {
		if ((window.localStorage.getItem('credentials')?.toString() as string) != null) {
			const credentials: Credentials = JSON.parse(
				window.localStorage.getItem('credentials')?.toString() as string
			);
			if (areas.find(area => area.areaId === credentials.area) !== undefined) {
				renderApp(credentials.area);
			}
		}
	}, [renderApp, areas]);

	return (
		<div className="LoginPage">
			<div className="LoginPageMain">
				<h1>Choisissez votre Organisation</h1>
				{areas.map((area, i) => {
					return (
						<div className="AreaLogin" key={i} onClick={() => renderApp(area.areaId)}>
							{area.areaName}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default ChooseArea;
