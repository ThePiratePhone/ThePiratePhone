import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './Components/Footer';
import Header from './Components/Header';

import CallingDesktop from './Pages/CallingDesktop';
import CallingMobile from './Pages/CallingMobile';
import Dashboard from './Pages/Dashboard';
import E404 from './Pages/E404';

import { mobileCheck } from './Utils';

function App({ caller, credentials }: { caller: Caller; credentials: Credentials }) {
	const elements = [
		{
			path: '/',
			element: <Dashboard />
		},
		{
			path: '/Calling',
			element: mobileCheck() ? <CallingMobile credentials={credentials} /> : <CallingDesktop />
		},
		{
			path: '/*',
			element: <E404 />
		}
	];

	return (
		<BrowserRouter>
			<div className="Main">
				<Header caller={caller} />
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
