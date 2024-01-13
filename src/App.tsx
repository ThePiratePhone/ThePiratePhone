import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './Components/Footer';
import Header from './Components/Header';

import Calling from './Pages/Calling';
import Dashboard from './Pages/Dashboard';
import E404 from './Pages/E404';

function App({ caller }: { caller: Caller }) {
	const [ActiveCaller, setActiveCaller] = useState(caller);

	const elements = [
		{
			path: '/',
			element: <Dashboard />
		},
		{
			path: '/Calling',
			element: <Calling />
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
