import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './Components/Footer';
import Header from './Components/Header';

import Calling from './Pages/Calling';
import Dashboard from './Pages/Dashboard';
import E404 from './Pages/E404';
import Account from './Pages/Account';
import { mobileCheck } from './Utils';

function App({
	caller,
	credentials,
	renderLogin
}: {
	caller: Caller;
	credentials: Credentials;
	renderLogin: () => void;
}) {
	const isMobile = mobileCheck();

	const elements = [
		{
			path: '/',
			element: <Dashboard credentials={credentials} caller={caller} isMobile={isMobile} />
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
