import React from 'react';
import ReactDOM from 'react-dom/client';

import './Stylesheets/index.css';

import './declarations.d.ts';

import App from './App';
import ChooseArea from './Pages/ChooseArea';
import LoginPage from './Pages/Login';
import { mobileCheck } from './Utils';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

function renderApp(caller: Caller, credentials: Credentials, areas: Array<Campaign>, campaign: Campaign) {
	root.render(
		<React.StrictMode>
			<App
				currentCampaign={campaign}
				credentials={credentials}
				caller={caller}
				areas={areas}
				renderLogin={renderLogin}
			/>
		</React.StrictMode>
	);
}

function chooseArea(caller: Caller, credentials: { phone: string; pinCode: string }, areas: Array<Campaign>) {
	function callback(area: Campaign) {
		const Credentials = {
			phone: credentials.phone,
			pinCode: credentials.pinCode,
			area: area.areaId
		};
		window.localStorage.setItem('credentials', JSON.stringify(Credentials));
		renderApp(caller, Credentials, areas, area);
	}

	if (areas.length === 1) {
		callback(areas[0]);
	}

	root.render(
		<React.StrictMode>
			<ChooseArea renderApp={callback} areas={areas} />
		</React.StrictMode>
	);
}

function renderLogin() {
	root.render(
		<React.StrictMode>
			<LoginPage chooseArea={chooseArea} />
		</React.StrictMode>
	);
}

if (mobileCheck()) {
	renderLogin();
} else {
	root.render(
		<div className="DesktopHomePage">
			Une version de bureau ?<br />
			Un jour peut-être 😏 <br />
			En attendant, rendez-vous sur mobile !
		</div>
	);
}
