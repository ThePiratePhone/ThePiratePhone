import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { cleanNumber } from '../../Utils/Cleaners';
import Button from '../Button';
import Loader from '../Loader';

function CallEnd({
	client,
	caller,
	time,
	credentials,
	nextCall,
	status,
	smsScript
}: {
	client: Client;
	caller: Caller;
	time: number;
	credentials: CredentialsV2;
	nextCall: () => void;
	status: Array<CallStatus>;
	smsScript: string | undefined;
}) {
	const [Loading, setLoading] = useState(false);
	const navigate = useNavigate();

	function click() {
		const satisfaction = (document.getElementById('satisfaction') as HTMLInputElement).value;
		let comment: string | undefined = (document.getElementById('comment') as HTMLInputElement).value.trim();

		if (comment === '') {
			comment = undefined;
		}

		setLoading(true);
		post(satisfaction, status.find(val => val.name == satisfaction)!.toRecall, comment).then(res => {
			if (res) {
				nextCall();
			} else {
				setLoading(false);
			}
		});
	}

	async function post(satisfaction: string, recall: boolean, comment?: string) {
		try {
			await axios.post(credentials.URL + '/caller/endCall', {
				phone: credentials.phone,
				pinCode: credentials.pinCode,
				campaign: credentials.campaign,
				timeInCall: time,
				comment: comment,
				satisfaction: satisfaction,
				status: recall
			});
			return true;
		} catch (err: any) {
			if (err.response?.data?.message) {
				return true;
			} else {
				console.error(err);
				return false;
			}
		}
	}

	async function cancel() {
		try {
			await axios.post(credentials.URL + '/caller/giveUp', credentials);
			return true;
		} catch (err: any) {
			console.error(err);
			return false;
		}
	}

	function cleanSms(smsScript: string) {
		smsScript = smsScript.replace('(clientName)', client.name);
		smsScript = smsScript.replace('(clientFisrtName)', client.firstname);
		smsScript = smsScript.replace('(callerName)', caller.name);
		return smsScript;
	}
	return (
		<div className="CallingEndContainer">
			<div className="CallingEnded">
				<div className="UserEnded">
					<h2 className="UserNameEnded">{client.name}</h2>
					<div className="Phone">{cleanNumber(client.phone)}</div>
				</div>
				<h3>Comment s'est passé cet appel ?</h3>
			</div>
			<div className="CallingButtons">
				<select className="inputField" id="satisfaction" defaultValue={1}>
					{status.map((value, i) => {
						if (value.name.startsWith('[hide]')) return;

						return (
							<option key={i} value={value.name}>
								{value.name}
							</option>
						);
					})}
				</select>
				<textarea className="inputField comment" placeholder="Commentaire" id="comment"></textarea>
				{smsScript != undefined ? (
					<a
						className={'ButtonClass'}
						href={'sms:' + client.phone + '&body=' + cleanSms(smsScript)}
						onClick={click}
					>
						envoyer un sms et confirmé
					</a>
				) : (
					<></>
				)}
				<Button value={smsScript == undefined ? 'confirmé' : 'confirmé seulent'} onclick={click} />
				<Button
					value="Annuler"
					onclick={() => {
						setLoading(true);
						cancel().then(res => {
							if (res) {
								navigate('/');
							} else {
								setLoading(false);
							}
						});
					}}
					type="RedButton"
				/>
			</div>
			{Loading ? <Loader /> : <></>}
		</div>
	);
}

export default CallEnd;
