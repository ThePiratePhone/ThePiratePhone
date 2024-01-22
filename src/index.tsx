import React from 'react';
import ReactDOM from 'react-dom/client';

import './Stylesheets/index.css';
import './Stylesheets/mobile.css';

import './declarations.d.ts';

import App from './App';
import LoginPage from './Pages/Login';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

function renderApp(caller: Caller, credentials: Credentials) {
	root.render(
		<React.StrictMode>
			<App credentials={credentials} caller={caller} />
		</React.StrictMode>
	);
}

root.render(
	<React.StrictMode>
		<LoginPage render={renderApp} />
		{/*<App caller={{ name: 'Caller 1', callTime: new Map(), number: '0987654321', pin: '3026' }} />*/}
	</React.StrictMode>
);
