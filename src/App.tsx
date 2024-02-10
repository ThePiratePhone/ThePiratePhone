import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './Components/Footer';
import Header from './Components/Header';

import Account from './Pages/Account';
import Calling from './Pages/Calling';
import ChangePassword from './Pages/ChangePassword';
import Dashboard from './Pages/Dashboard';
import E404 from './Pages/E404';
import Join from './Pages/Join';
import Recall from './Pages/Recall';
import Switch from './Pages/Switch';
import { mobileCheck } from './Utils';

function App({
	caller,
	credentials,
	areas,
	currentCampaign,
	renderLogin
}: {
	caller: Caller;
	credentials: Credentials;
	areas: Array<Campaign>;
	currentCampaign: Campaign;
	renderLogin: () => void;
}) {
	const isMobile = mobileCheck();

	const [Credentials, setCredentials] = useState(credentials);
	const [CurrentCampaign, setCurrentCampaign] = useState(currentCampaign);
	const [Caller, setCaller] = useState(caller);

	function addCampaign(newCampaign: Campaign) {
		areas.push(newCampaign);
		areas = areas.sort((a, b) => {
			if (a.areaName > b.areaName) {
				return 1;
			} else if (a.areaName < b.areaName) {
				return -1;
			}
			return 0;
		});

		window.localStorage.setItem('credentials', JSON.stringify(credentials));
		setCurrentCampaign(newCampaign);
	}

	function changeCredentials(credentials: Credentials) {
		setCredentials(credentials);
		setCaller(cal => {
			cal.pinCode = credentials.pinCode;
			return cal;
		});
		window.localStorage.setItem('credentials', JSON.stringify(credentials));
	}

	const elements = [
		{
			path: '/',
			element: (
				<Dashboard campaign={CurrentCampaign} credentials={Credentials} caller={Caller} isMobile={isMobile} />
			)
		},
		{
			path: '/Switch',
			element: (
				<Switch
					areas={areas}
					setCredentials={changeCredentials}
					switchArea={(area: Campaign) => {
						setCredentials(old => {
							old.area = area.areaId;
							return old;
						});
						window.localStorage.setItem('credentials', JSON.stringify(credentials));
						setCurrentCampaign(area);
					}}
					credentials={Credentials}
				/>
			)
		},
		{
			path: '/Join',
			element: (
				<Join
					credentials={Credentials}
					setCredentials={changeCredentials}
					addCampaign={addCampaign}
					areas={areas}
				/>
			)
		},
		{
			path: '/Calling',
			element: <Calling credentials={Credentials} isMobile={isMobile} />
		},
		{
			path: '/Recall',
			element: <Recall credentials={Credentials} />
		},
		{
			path: '/Account',
			element: <Account caller={Caller} renderLogin={renderLogin} />
		},
		{
			path: '/ChangePassword',
			element: <ChangePassword credentials={Credentials} setCredentials={changeCredentials} />
		},
		{
			path: '/*',
			element: <E404 />
		}
	];

	return (
		<BrowserRouter>
			<div className="Main">
				<Header isMobile={isMobile} />
				<div className="App">
					<Routes>
						{elements.map((element, i) => {
							return <Route path={element.path} element={element.element} key={i} />;
						})}
					</Routes>
				</div>
				<Footer />
			</div>
		</BrowserRouter>
	);
}

export default App;
