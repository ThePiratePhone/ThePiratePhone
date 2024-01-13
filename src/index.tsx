import React from 'react';
import ReactDOM from 'react-dom/client';

import './Stylesheets/index.css';
import './Stylesheets/mobile.css';

import './declarations.d.ts';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

process.env.URL = 'https://dfg.freeboxos.fr:7000/api';

function renderApp(caller: Caller) {
	root.render(
		<React.StrictMode>
			<App caller={caller} />
		</React.StrictMode>
	);
}

root.render(
	<React.StrictMode>
		{/*<LoginPage render={renderApp} />*/}
		<App caller={{ name: 'Caller 1', callTime: new Map(), number: '0987654321', pin: '3026' }} />
	</React.StrictMode>
);
