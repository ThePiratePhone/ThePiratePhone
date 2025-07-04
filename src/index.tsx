import ReactDOM from 'react-dom/client';

import App from './App';
import LoginPage from './Pages/Login';
import { mobileCheck } from './Utils/Utils';

import './Stylesheets/index.scss';

import './declarations.d.ts';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const ApiUrl = 'https://api.pp.qamp.fr';
function renderApp(caller: Caller, credentials: CredentialsV2, campaigns: Array<Campaign>, campaign: Campaign) {
	credentials.URL = ApiUrl;
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

function renderLogin() {
	root.render(<LoginPage renderApp={renderApp} />);
}

if (mobileCheck()) {
	renderLogin();
} else {
	root.render(
		<div className="DesktopHomePage">Cette application n'est pas disponible sur PC. Rendez-vous sur mobile !</div>
	);
}
export default ApiUrl;
