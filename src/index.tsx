import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import Choose from './Pages/Choose';
import LoginPage from './Pages/Login';
import { mobileCheck } from './Utils';

import './Stylesheets/index.css';

import './declarations.d.ts';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const URL = 'https://pp.mpqa.fr:8443/api';

function renderApp(caller: Caller, credentials: Credentials, campaigns: Array<Campaign>, campaign: Campaign) {
	credentials.URL = URL;
	root.render(
		<React.StrictMode>
			<App
				currentCampaign={campaign}
				credentials={credentials}
				caller={caller}
				campaigns={campaigns}
				renderLogin={renderLogin}
			/>
		</React.StrictMode>
	);
}

function chooseArea(caller: Caller, credentials: { phone: string; pinCode: string }, areas: AreaCombo) {
	function callback(area: Campaign) {
		const Credentials = {
			phone: credentials.phone,
			pinCode: credentials.pinCode,
			area: area.areaId,
			URL: URL
		};
		window.localStorage.setItem('credentials', JSON.stringify(Credentials));
		renderApp(caller, Credentials, areas.campaignAvailable, area);
	}

	if (areas.campaignAvailable.length === 1) {
		callback(areas.campaignAvailable[0]);
	}

	const Credentials = {
		phone: credentials.phone,
		pinCode: credentials.pinCode,
		URL: URL,
		area: areas.area._id
	};

	root.render(
		<React.StrictMode>
			<Choose credentials={Credentials} renderApp={callback} areas={areas.campaignAvailable} />
		</React.StrictMode>
	);
}

function renderLogin() {
	root.render(
		<React.StrictMode>
			<LoginPage URL={URL} chooseArea={chooseArea} />
		</React.StrictMode>
	);
}

if (mobileCheck()) {
	renderLogin();
} else {
	root.render(
		<div className="DesktopHomePage">Cette application n'est pas disponible sur PC. Rendez-vous sur mobile !</div>
	);
}
