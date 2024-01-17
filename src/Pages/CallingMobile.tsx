import axios from 'axios';
import { useEffect, useState } from 'react';

import Script from '../Components/Script';

import { cleanNumber } from '../Utils';

async function getNewClient(): Promise<User | undefined> {
	return {
		name: 'Caller 1',
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

function CallingMobile() {
	const [user, setUser] = useState(<></>);
	const [script, setScript] = useState(<></>);

	const time = Date.now();

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
						<h2 className="UserName">{result.name}</h2>{' '}
						<a href={'tel:' + result.number} className="CallButton">
							<div>{cleanNumber(result.number)}</div>
							<button>APPELER</button>
						</a>
					</div>
				);
			} else {
				setUser(<div>Une erreur est survenue :/</div>);
			}
		});
	}, [setUser, setScript]);

	function endCall() {
		alert((Date.now() - time) / 1000);
	}

	return (
		<div className="Calling">
			<div className="CallingHeader">
				<h2>Prochain contact</h2>
				{user}
			</div>
			<div className="CallingEnd">
				<div className="NavButton">
					<button onClick={endCall}>PAS DE RÉPONSE</button>
				</div>
				<div className="NavButton">
					<button onClick={endCall}>FIN D'APPEL</button>
				</div>
			</div>
			{script}
		</div>
	);
}

export default CallingMobile;
