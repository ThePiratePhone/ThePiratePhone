import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './Components/Footer';
import Header from './Components/Header';

import Account from './Pages/Account';
import Calling from './Pages/Calling';
import Dashboard from './Pages/Dashboard';
import E404 from './Pages/E404';
import Join from './Pages/Join';
import Switch from './Pages/Switch';
import { mobileCheck } from './Utils';
import { useState } from 'react';

function App({
	caller,
	credentials,
	areas,
	currentArea,
	renderLogin
}: {
	caller: Caller;
	credentials: Credentials;
	areas: Array<AreaCombo>;
	currentArea: AreaCombo;
	renderLogin: () => void;
}) {
	const isMobile = mobileCheck();

	const [Credentials, setCredentials] = useState(credentials);
	const [CurrentArea, setCurrentArea] = useState(currentArea);

	function addArea(newArea: AreaCombo) {
		areas.push(newArea);
		areas = areas.sort((a, b) => {
			if (a.areaName > b.areaName) {
				return 1;
			} else if (a.areaName < b.areaName) {
				return -1;
			}
			return 0;
		});
		setCurrentArea(newArea);
	}

	const elements = [
		{
			path: '/',
			element: <Dashboard areaCombo={CurrentArea} credentials={Credentials} caller={caller} isMobile={isMobile} />
		},
		{
			path: '/Switch',
			element: (
				<Switch
					areas={areas}
					setCredentials={setCredentials}
					switchArea={setCurrentArea}
					credentials={Credentials}
				/>
			)
		},
		{
			path: '/Join',
			element: <Join credentials={Credentials} setCredentials={setCredentials} addArea={addArea} areas={areas} />
		},
		{
			path: '/Calling',
			element: <Calling credentials={Credentials} isMobile={isMobile} />
		},
		{
			path: '/Account',
			element: <Account caller={caller} renderLogin={renderLogin} />
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
