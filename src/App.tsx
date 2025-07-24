import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './Components/Footer';
import Header from './Components/Header';
import ThemeProvider from './Components/ThemeProvider';
import Calling from './Pages/Calling';
import ChangeName from './Pages/ChangeName';
import ChangePassword from './Pages/ChangePassword';
import ChangeTheme from './Pages/ChangeTheme';
import Dashboard from './Pages/Dashboard';
import E404 from './Pages/E404';
import Recall from './Pages/Recall';
import ScoreBoard from './Pages/ScoreBoard';
import Settings from './Pages/Settings';
import { campaignSorter } from './Utils/Sorters';
import { getLocalTheme, setPreferredCampaign } from './Utils/Storage';
import { parseCampaign } from './Utils/Utils';
import Switch from './Pages/Switch';
import Join from './Pages/Join';

function App({
	caller,
	credentials,
	campaigns,
	currentCampaign,
	renderLogin
}: {
	caller: Caller;
	credentials: CredentialsV2;
	campaigns: Array<Campaign>;
	currentCampaign: Campaign;
	renderLogin: () => void;
}) {
	const [Credentials, setCredentials] = useState(credentials);
	const [CurrentCampaign, setCurrentCampaign] = useState(currentCampaign);
	const [Theme, setTheme] = useState(getLocalTheme());
	const [Caller, setCaller] = useState(caller);

	campaigns = parseCampaign(campaigns);

	function addCampaign(newCampaign: Campaign) {
		campaigns.push(newCampaign);
		campaigns = campaigns.sort(campaignSorter);
		switchCampaign(newCampaign);
	}

	function changeCredentials(newCredentials: CredentialsV2) {
		setCaller(cal => {
			cal.pinCode = newCredentials.pinCode;
			return cal;
		});
		setCredentials(newCredentials);
	}

	function switchCampaign(campaign: Campaign) {
		credentials.campaign = campaign._id;
		setCredentials(old => {
			old.campaign = campaign._id;
			setCredentials(old);
			return old;
		});
		setCurrentCampaign(campaign);
		setPreferredCampaign(campaign);
	}

	const ELEMENTS = [
		{
			path: '/',
			element: <Dashboard credentials={Credentials} />
		},
		{
			path: '/Switch',
			element: (
				<Switch
					campaigns={campaigns}
					setCredentials={changeCredentials}
					switchCampaign={switchCampaign}
					credentials={Credentials}
				/>
			)
		},
		{
			path: '/Join',
			element: (
				<Join
					next={undefined}
					credentials={Credentials}
					setCredentials={changeCredentials}
					addCampaign={addCampaign}
				/>
			)
		},
		{
			path: '/Calling',
			element: <Calling setCampaign={setCurrentCampaign} campaign={CurrentCampaign} credentials={Credentials} />
		},
		{
			path: '/Recall',
			element: <Recall status={CurrentCampaign.status} credentials={Credentials} />
		},
		{
			path: '/ScoreBoard',
			element: <ScoreBoard credentials={Credentials} />
		},
		{
			path: '/Settings',
			element: <Settings caller={Caller} renderLogin={renderLogin} />
		},
		{
			path: '/ChangeName',
			element: <ChangeName caller={Caller} credentials={Credentials} setCaller={setCaller} />
		},
		{
			path: '/ChangePassword',
			element: <ChangePassword credentials={Credentials} setCredentials={changeCredentials} />
		},
		{
			path: '/ChangeTheme',
			element: <ChangeTheme Theme={Theme} setTheme={setTheme} />
		},
		{
			path: '/*',
			element: <E404 />
		}
	];

	return (
		<BrowserRouter>
			<ThemeProvider themeId={Theme}>
				<div className="Main">
					<Header areaName={CurrentCampaign.areaName} />
					<div className="App">
						<Routes>
							{ELEMENTS.map((element, i) => {
								return <Route path={element.path} element={element.element} key={i} />;
							})}
						</Routes>
					</div>
					<Footer />
				</div>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
