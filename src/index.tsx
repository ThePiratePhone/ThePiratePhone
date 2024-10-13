import ReactDOM from 'react-dom/client';

import App from './App';
import Choose from './Pages/Choose';
import LoginPage from './Pages/Login';
import { setCredentials } from './Utils/Storage';
import { mobileCheck } from './Utils/Utils';

import './Stylesheets/index.scss';

import './declarations.d.ts';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const URL = 'https://pp.mpqa.fr:8443/api';

function renderApp(caller: Caller, credentials: Credentials, campaigns: Array<Campaign>, campaign: Campaign) {
	credentials.URL = URL;
	root.render(
		<App
			currentCampaign={campaign}
			credentials={credentials}
			caller={caller}
			campaigns={campaigns}
			renderLogin={renderLogin}
		/>
	);
}

function chooseArea(caller: Caller, credentials: { phone: string; pinCode: string }, areas: AreaCombo) {
	function callback(campaign: Campaign) {
		const newCredentials = {
			phone: credentials.phone,
			pinCode: credentials.pinCode,
			area: campaign.areaId,
			URL: URL
		};
		setCredentials(newCredentials);
		renderApp(caller, newCredentials, areas.campaignAvailable, campaign);
	}

	if (areas.campaignAvailable.length === 1) {
		callback(areas.campaignAvailable[0]);
	}

	const newCredentials = {
		phone: credentials.phone,
		pinCode: credentials.pinCode,
		URL: URL,
		area: areas.area._id
	};

	root.render(<Choose credentials={newCredentials} renderApp={callback} areas={areas.campaignAvailable} />);
}

function renderLogin() {
	root.render(<LoginPage URL={URL} chooseArea={chooseArea} />);
}

if (mobileCheck()) {
	renderLogin();
} else {
	root.render(
		<div className="DesktopHomePage">Cette application n'est pas disponible sur PC. Rendez-vous sur mobile !</div>
	);
}
