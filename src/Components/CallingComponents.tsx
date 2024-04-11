import axios from 'axios';

import Button from './Button';
import Script from './Script';

import { useNavigate } from 'react-router-dom';
import { cleanCallingTime, cleanNumber, cleanStatus } from '../Utils';

function InCallMobile({
	client,
	script,
	campaign,
	endCall,
	cancel
}: {
	client: User;
	script: string;
	campaign: Campaign;
	endCall: () => void;
	cancel: () => void;
}) {
	function infos() {
		let value = '';
		client.data[campaign._id].forEach((res, i) => {
			const timeInCall = new Date(res.startCall).getTime() - new Date(res.endCall).getTime();

			if (res.status == 'Todo') return;
			if (i == client.data[campaign._id].length - 1) return;
			value +=
				i +
				1 +
				' ' +
				(timeInCall != 0
					? '(' + cleanCallingTime(new Date(res.startCall).getTime() - new Date(res.endCall).getTime()) + ')'
					: '') +
				cleanStatus(res.status) +
				(res.comment ? ': ' + res.comment : '') +
				'\n';
		});
		if (!value) window.alert('Jamais appelé·e');
		else window.alert(value);
	}

	return (
		<>
			<div className="CallingHeader">
				<div className="CallActions">
					<Button value="Annuler" type="RedButton" onclick={cancel} />
					<Button value="Voir l'historique" onclick={infos} />
					<Button value="Fin d'appel" onclick={endCall} />
				</div>
				<div className="User">
					<h2 className="UserName">{client.name}</h2>
					<a href={'tel:' + client.phone} className="Button">
						<div className="Phone">{cleanNumber(client.phone)}</div>
						<button>Appeler</button>
					</a>
				</div>
			</div>
			<Script script={script} />
		</>
	);
}

function OutOfHours({ campaign, next }: { campaign: Campaign; next: () => void }) {
	if (!campaign.callHoursStart || !campaign.callHoursEnd)
		return <div className="CallingError">Une erreur est survenue :/</div>;

	const start = campaign.callHoursStart.toLocaleTimeString().split('').slice(0, -3).join('');
	const end = campaign.callHoursEnd.toLocaleTimeString().split('').slice(0, -3).join('');

	return (
		<div className="CallingHoursError">
			<h4>Vous n'êtes pas dans la plage horaire d'appel</h4>
			<div>
				<span className="Phone">{start}</span> à <span className="Phone">{end}</span>
			</div>
			<Button value="Continuer quand même" type="RedButton" onclick={next} />
		</div>
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
		{ name: 'Pas interessé·e', value: -1 },
		{ name: 'À retirer', value: -2 },
		{ name: 'Pas de réponse', value: 0 }
	];

	const navigate = useNavigate();

	function click() {
		const satisfaction = parseInt((document.getElementById('satisfaction') as HTMLInputElement).value);
		let comment: string | undefined = (document.getElementById('comment') as HTMLInputElement).value.trim();

		if (comment === '') {
			comment = undefined;
		}

		post(satisfaction, time, comment).then(res => {
			if (res) {
				nextCall();
			}
		});
	}

	function post(satisfaction: number, time: number, comment?: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/endCall', {
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

	function cancel() {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/giveUp', {
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					area: credentials.area
				})
				.then(() => resolve(true))
				.catch(err => {
					console.error(err);
					resolve(false);
				});
		});
	}

	return (
		<div className="CallingEndContainer">
			<div className="CallingEnded">
				{time === 0 ? <h3>Ancien appel récupéré !</h3> : <></>}
				<div className="UserEnded">
					<h2 className="UserNameEnded">{client.name}</h2>
					<div className="Phone">{cleanNumber(client.phone)}</div>
				</div>
				<h3>Comment s'est passé cet appel ?</h3>
			</div>
			<div className="CallingButtons">
				<select className="inputField" id="satisfaction" defaultValue={0}>
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
				<Button
					value="Annuler"
					onclick={() => {
						cancel().then(res => {
							if (res) {
								navigate('/');
							}
						});
					}}
					type="RedButton"
				/>
			</div>
		</div>
	);
}

export { CallEndMobile, InCallMobile, OutOfHours };
