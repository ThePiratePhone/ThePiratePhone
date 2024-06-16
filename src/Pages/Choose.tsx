import { useEffect, useState } from 'react';

import Button from '../Components/Button';
import { campaignSorter } from '../Utils/Sorters';
import { clearCredentials, getCredentials } from '../Utils/Storage';
import Join from './Join';

function ChooseArea({ renderApp, areas }: { renderApp: (area: Campaign) => void; areas: Array<Campaign> }) {
	function click() {
		const areaId = (document.getElementById('area') as HTMLInputElement).value;
		const area = areas.find(val => val.areaId === areaId) as Campaign;
		renderApp(area);
	}

	areas = areas.sort(campaignSorter);

	useEffect(() => {
		if (getCredentials() != null) {
			const credentials = getCredentials();
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
	const [Page, setPage] = useState(<ChooseArea areas={areas} renderApp={renderApp} />);

	function next() {
		renderApp(campaign as Campaign);
	}

	useEffect(() => {
		if (areas.length === 0) {
			clearCredentials();
			setPage(
				<Join
					next={next}
					addCampaign={newCampaign => {
						campaign = newCampaign;
					}}
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
