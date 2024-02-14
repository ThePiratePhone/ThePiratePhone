import axios from 'axios';

import Button from './Button';
import Script from './Script';

import { cleanNumber } from '../Utils';
import { useState } from 'react';

const URL = 'https://cs.mpqa.fr:7000/api';

function post(credentials: Credentials, satisfaction: number, time: number, comment?: string) {
	return new Promise<boolean>(resolve => {
		axios
			.post(URL + '/endCall', {
				phone: credentials.phone,
				pinCode: credentials.pinCode,
				area: credentials.area,
				timeInCall: time,
				comment: comment,
				satisfaction: satisfaction
			})
			.then(() => resolve(true))
			.catch(err => {
				if (err.response?.data?.message) {
					resolve(true);
				} else {
					console.error(err);
					resolve(false);
				}
			});
	});
}

function InCallMobile({
	client,
	script,
	endCall,
	newCall,
	cancel,
	credentials
}: {
	client: User;
	script: string;
	endCall: () => void;
	newCall: () => void;
	cancel: () => void;
	credentials: Credentials;
}) {
	return (
		<>
			<div className="CallingHeader">
				<div className="CallActions">
					<Button value="Annuler" type="RedButton" onclick={cancel} />
					<Button value="Fin d'appel" onclick={endCall} />
				</div>
				<div className="User">
					<h2 className="UserName">{client.name}</h2>
					<a href={'tel:' + client.phone} className="Button CallButton">
						<div className="PhoneNumber">{cleanNumber(client.phone)}</div>
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
	const VALUES = [
		{ name: 'Voté pour nous', value: 2 },
		{ name: 'Pas voté pour nous', value: 1 },
		{ name: 'Pas interessé', value: -1 },
		{ name: 'A retirer', value: -2 }
	];

	function click() {
		const satisfaction = parseInt((document.getElementById('satisfaction') as HTMLInputElement).value);
		let comment: string | undefined = (document.getElementById('comment') as HTMLInputElement).value.trim();

		if (comment == '') {
			comment = undefined;
		}

		post(credentials, satisfaction, time, comment).then(res => {
			if (res) {
				nextCall();
			}
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
				<select className="inputField" id="satisfaction">
					{VALUES.map((value, i) => {
						return (
							<option key={i} value={value.value}>
								{value.name}
							</option>
						);
					})}
				</select>
				<textarea className="inputField comment" placeholder="Commentaire" id="comment"></textarea>
				<Button value="Confirmer" onclick={click} />
				<Button value="Pas de réponse" onclick={click} type="RedButton" />
			</div>
		</div>
	);
}

export { CallEndMobile, InCallMobile };
