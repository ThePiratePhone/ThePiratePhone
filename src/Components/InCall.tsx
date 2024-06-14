import { cleanNumber } from '../Utils';
import Button from './Button';
import CallHistory from './CallHistory';
import Script from './Script';

function InCall({
	client,
	script,
	campaign,
	endCall,
	cancel
}: {
	client: Client;
	script: string;
	campaign: Campaign;
	endCall: () => void;
	cancel: () => void;
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
					<a href={'tel:' + client.phone} className="Button">
						<div className="Phone">{cleanNumber(client.phone)}</div>
						<button>Appeler</button>
					</a>
				</div>
			</div>
			<CallHistory campaign={campaign} client={client} />
			<Script script={script} />
		</>
	);
}

export default InCall;
