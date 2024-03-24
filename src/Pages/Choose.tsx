import { useEffect, useState } from 'react';

import Button from '../Components/Button';
import Join from './Join';

function ChooseArea({
	renderApp,
	areas,
	join
}: {
	renderApp: (area: Campaign) => void;
	areas: Array<Campaign>;
	join: () => void;
}) {
	function click() {
		const areaId = (document.getElementById('area') as HTMLInputElement).value;
		const area = areas.find(val => val.areaId === areaId) as Campaign;
		renderApp(area);
	}
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
	);
}

function Choose({
	renderApp,
	areas,
	credentials
}: {
	renderApp: (area: Campaign) => void;
	areas: Array<Campaign>;
	credentials: Credentials;
}) {
	let campaign: Campaign | undefined = undefined;
	const [Page, setPage] = useState(
		<ChooseArea
			areas={areas}
			renderApp={renderApp}
			join={() =>
				setPage(
					<Join
						next={next}
						addCampaign={cmp => {
							campaign = cmp;
						}}
						credentials={credentials}
						setCredentials={() => {}}
						areas={areas}
					/>
				)
			}
		/>
	);

	function next() {
		renderApp(campaign as Campaign);
	}

	useEffect(() => {
		if (areas.length === 0) {
			window.localStorage.removeItem('credentials');
			setPage(
				<Join
					next={next}
					addCampaign={() => {}}
					credentials={credentials}
					setCredentials={() => {}}
					areas={areas}
				/>
			);
		}
	}, []);

	return <div className="LoginPage">{Page}</div>;
}

export default Choose;
