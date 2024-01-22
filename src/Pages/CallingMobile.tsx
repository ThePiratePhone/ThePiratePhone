import axios from 'axios';
import { useEffect, useState } from 'react';

import Script from '../Components/Script';

import { cleanNumber } from '../Utils';

const URL = 'http://192.168.1.17:7000/api';

async function getNewClient(credentials: Credentials): Promise<{ client: User; script: string } | undefined> {
	//return {
	//	client: {
	//		name: 'Caller 1',
	//		number: '+33123456789',
	//		callStatus: 'Todo',
	//		callEnd: undefined,
	//		callerNumber: undefined,
	//		callStart: undefined,
	//		scriptVersion: undefined
	//	},
	//	script: 'This is a script !'
	//};
	return new Promise(resolve => {
		axios
			.post(URL + '/getPhoneNumber', credentials)
			.then(result => {
				if (result) {
					resolve(result.data.data);
				} else {
					resolve(undefined);
				}
			})
			.catch(err => {
				console.error(err);
				resolve(undefined);
			});
	});
}

function CallingMobile({ credentials }: { credentials: Credentials }) {
	const [user, setUser] = useState<User | string | undefined>(undefined);
	const [script, setScript] = useState<string | null>(null);

	const time = Date.now();

	useEffect(() => {
		getNewClient(credentials).then(result => {
			if (typeof result != 'undefined') {
				setUser(result.client);
				setScript(result.script);
			} else {
				setUser('Une erreur est survenue :/');
			}
		});
	}, [credentials]);

	function endCall() {
		alert((Date.now() - time) / 1000);
	}

	return (
		<div className="Calling">
			<div className="CallingHeader">
				<h2>Prochain contact</h2>
				{(() => {
					if (typeof user == 'string') {
						return <>{user}</>;
					} else {
						return user ? (
							<div className="User">
								<h2 className="UserName">{user.name}</h2>
								<a href={'tel:' + user.phone} className="CallButton">
									<div>{cleanNumber(user.phone)}</div>
									<button>APPELER</button>
								</a>
							</div>
						) : (
							<></>
						);
					}
				})()}
			</div>
			<div className="CallingEnd">
				<div className="NavButton">
					<button onClick={endCall}>PAS DE RÉPONSE</button>
				</div>
				<div className="NavButton">
					<button onClick={endCall}>FIN D'APPEL</button>
				</div>
			</div>
			{(() => {
				return script ? <Script script={script} /> : <></>;
			})()}
		</div>
	);
}

export default CallingMobile;
