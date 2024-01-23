import axios from 'axios';

import Script from './Script';

import { cleanNumber } from '../Utils';

const URL = 'https://dfg.freeboxos.fr:7000/api';

function InCallMobile({ client, script, endCall }: { client: User; script: string; endCall: () => void }) {
	return (
		<>
			<div className="CallingHeader">
				<h2>Prochain contact</h2>
				<div className="User">
					<h2 className="UserName">{client.name}</h2>
					<a href={'tel:' + client.phone} className="CallButton">
						<div>{cleanNumber(client.phone)}</div>
						<button>APPELER</button>
					</a>
				</div>
			</div>
			<div className="CallingEnd">
				<div className="NavButton">
					<button onClick={endCall}>FIN D'APPEL</button>
				</div>
			</div>
			<Script script={script} />;
		</>
	);
}

function CallEndMobile({ client, time, credentials }: { client: User; time: number; credentials: Credentials }) {
	async function post(satisfaction: number) {
		return new Promise(resolve => {
			axios
				.post(URL + '/endCall', {
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					area: credentials.area,
					timeInCall: time,
					satisfaction: satisfaction
				})
				.then(resolve)
				.catch(error => {
					console.error(error);
					resolve(false);
				});
		});
	}

	return (
		<div className="CallingEndContainer">
			<div className="CallingEnded">
				<div className="UserEnded">
					<h2 className="UserNameEnded">{client.name}</h2>
					<div>{cleanNumber(client.phone)}</div>
				</div>
				<h2>Comment s'est passé cet appel ?</h2>
			</div>
			<div className="CallingButtons">
				<div className="NavButton">
					<button onClick={() => post(0)}>Pas de réponse</button>
				</div>
				<div className="NavButton">
					<button onClick={() => post(2)}>Voté pour nous</button>
				</div>
				<div className="NavButton">
					<button onClick={() => post(1)}>Pas voté pour nous</button>
				</div>
				<div className="NavButton">
					<button onClick={() => post(-1)}>Pas interessé</button>
				</div>
				<div className="NavButton RedButton">
					<button>A retirer</button>
				</div>
			</div>
		</div>
	);
}

export { CallEndMobile, InCallMobile };
