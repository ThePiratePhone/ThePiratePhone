import axios from 'axios';
import { useEffect, useState } from 'react';

import Script from '../Components/Script';

import { cleanNumber } from '../Utils';

async function getNewClient(): Promise<User | undefined> {
	return {
		name: 'Personnnnnnnnnnnnnnnnnnnn 1',
		number: '+33123456789',
		callStatus: 'Todo',
		callEnd: undefined,
		callerNumber: undefined,
		callStart: undefined,
		scriptVersion: undefined
	};
	return new Promise(resolve => {
		axios
			.post(URL + '/', {})
			.then(result => {
				if (result) {
					resolve(result.data.user);
				} else {
					resolve(undefined);
				}
			})
			.catch(() => {
				resolve(undefined);
			});
	});
}

async function getScript(): Promise<string | undefined> {
	let script = '';

	for (let i = 0; i < 200; i++) {
		script += 'This is a script ! ';
	}

	return script;
	return new Promise(resolve => {
		axios
			.post(URL + '/', {})
			.then(result => {
				if (result) {
					resolve(result.data.user);
				} else {
					resolve(undefined);
				}
			})
			.catch(() => {
				resolve(undefined);
			});
	});
}

function CallingDesktop() {
	const [user, setUser] = useState(<></>);
	const [script, setScript] = useState(<></>);

	useEffect(() => {
		getScript().then(result => {
			if (typeof result != 'undefined') {
				setScript(<Script script={result} />);
			} else {
				setScript(<div>Une erreur est survenue :/</div>);
			}
		});
		getNewClient().then(result => {
			if (typeof result != 'undefined') {
				setUser(
					<div className="User">
						<div className="UserStats">
							<h2>{result.name}</h2>
							<div>{cleanNumber(result.number)}</div>
						</div>
						<a href={'tel:' + result.number} className="CallButton">
							<button>APPELER</button>
						</a>
					</div>
				);
			} else {
				setUser(<div>Une erreur est survenue :/</div>);
			}
		});
	}, [setUser, setScript]);

	return (
		<div className="Calling">
			<h2>Prochain contact</h2>
			{user}
			{script}
		</div>
	);
}

export default CallingDesktop;
