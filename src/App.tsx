import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './Components/Footer';
import Header from './Components/Header';

import Calling from './Pages/Calling';
import Dashboard from './Pages/Dashboard';
import E404 from './Pages/E404';
import Account from './Pages/Account';
import { mobileCheck } from './Utils';
import Join from './Pages/Join';
import SwitchArea from './Pages/SwitchArea';

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

	function setCredentials(newCredentials: Credentials, newAreaCombo: AreaCombo) {
		credentials = newCredentials;
		currentArea = newAreaCombo;
		areas.push(newAreaCombo);
		areas = areas.sort((a, b) => {
			if (a.areaName > b.areaName) {
				return 1;
			} else if (a.areaName < b.areaName) {
				return -1;
			}
			return 0;
		});
	}

	const elements = [
		{
			path: '/',
			element: <Dashboard areaCombo={currentArea} credentials={credentials} caller={caller} isMobile={isMobile} />
		},
		{
			path: '/SwitchArea',
			element: <SwitchArea areas={areas} setCredentials={setCredentials} />
		},
		{
			path: '/Join',
			element: <Join credentials={credentials} setCredentials={setCredentials} areas={areas} />
		},
		{
			path: '/Calling',
			element: <Calling credentials={credentials} isMobile={isMobile} />
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
