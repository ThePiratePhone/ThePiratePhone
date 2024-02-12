import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import Script from './Script';
import Button from './Button';

import { cleanNumber } from '../Utils';

const URL = 'https://cs.mpqa.fr:7000/api';

function InCallMobile({ client, script, endCall }: { client: User; script: string; endCall: () => void }) {
	return (
		<>
			<div className="CallingHeader">
				<div className="CallActions">
					<Button value="Annuler" type="RedButton" />
					<Button value="Fin d'appel" onclick={endCall} />
				</div>
				<div className="User">
					<h2 className="UserName">{client.name}</h2>
					<a href={'tel:' + client.phone} className="Button CallButton">
						<div className='PhoneNumber'>{cleanNumber(client.phone)}</div>
						<button>Appeler</button>
					</a>
				</div>
			</div>
			<Script script={script} />
		</>
	);
}

function CallEndMobile({
	client,
	time,
	credentials,
	nextCall
}: {
	client: User;
	time: number;
	credentials: Credentials;
	nextCall: () => void;
}) {
	async function post(satisfaction: number) {
		axios
			.post(URL + '/endCall', {
				phone: credentials.phone,
				pinCode: credentials.pinCode,
				area: credentials.area,
				timeInCall: time,
				satisfaction: satisfaction
			})
			.then(nextCall)
			.catch(err => {
				if (err.response?.data?.message) {
					nextCall();
				} else {
					console.error(err);
				}
			});
	}

	async function cancel() {
		axios
			.post(URL + '/', {
				phone: credentials.phone,
				pinCode: credentials.pinCode,
				area: credentials.area
			})
			.then(() => navigate('/'))
			.catch(err => {
				if (err.response?.data?.message) {
					navigate('/');
				} else {
					console.error(err);
				}
			});
	}

	const navigate = useNavigate();

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
				<Button value="Pas de réponse" onclick={() => post(0)} />
				<Button value="Voté pour nous" onclick={() => post(2)} />
				<Button value="Pas voté pour nous" onclick={() => post(1)} />
				<Button value="Pas interessé" onclick={() => post(-1)} />
				<Button value="A retirer" onclick={() => post(-2)} />
				<Button value="Annuler l'appel" type="RedButton" onclick={cancel} />
			</div>
		</div>
	);
}

function NextCallMobile({ newCall }: { newCall: () => void }) {
	return (
		<div className="CallingEndContainer">
			<div className="CallingEnded">
				<h2>
					Bien joué !<br /> Un autre ?
				</h2>
			</div>
			<div className="CallingButtons">
				<div className="Button">
					<button onClick={newCall}>C'est parti !</button>
				</div>
				<Link to="/" className="Button RedButton">
					<button>Stop</button>
				</Link>
			</div>
		</div>
	);
}

export { CallEndMobile, InCallMobile, NextCallMobile };
