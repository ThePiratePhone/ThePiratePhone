import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './Components/Footer';
import Header from './Components/Header';

import CallingDesktop from './Pages/CallingDesktop';
import CallingMobile from './Pages/CallingMobile';
import Dashboard from './Pages/Dashboard';
import E404 from './Pages/E404';

function mobileCheck() {
	const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

	return toMatch.some(toMatchItem => {
		return navigator.userAgent.match(toMatchItem);
	});
}

function App({ caller }: { caller: Caller }) {
	const [ActiveCaller, setActiveCaller] = useState(caller);

	const elements = [
		{
			path: '/',
			element: <Dashboard />
		},
		{
			path: '/Calling',
			element: mobileCheck() ? <CallingMobile /> : <CallingDesktop />
		},
		{
			path: '/*',
			element: <E404 />
		}
	];

	return (
		<BrowserRouter>
			<div className="Main">
				<Header caller={ActiveCaller} />
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
