import { cleanNumber } from '../../Utils/Cleaners';
import { saveCallingTime } from '../../Utils/Storage';
import Button from '../Button';
import CallHistory from './CallHistory';
import Script from './Script';

function InCall({
	client,
	script,
	priority,
	callHistory,
	endCall,
	cancel
}: {
	client: Client;
	script: string;
	priority: string;
	callHistory: Array<Call>;
	endCall: () => void;
	cancel: () => void;
}) {
	saveCallingTime();
	return (
		<>
			<div className="CallingHeader">
				<div className="CallActions">
					<Button value="Annuler" type="RedButton" onclick={cancel} />
					<Button value="Fin d'appel" onclick={endCall} />
				</div>
				<div className="User">
					<h2 className="UserName">
						{client.name} {client.firstname}
					</h2>
					<h2 className="priority">{priority}</h2>
					<a href={'tel:' + client.phone} className="Button">
						<div className="Phone">{cleanNumber(client.phone)}</div>
						<button>Appeler</button>
					</a>
				</div>
			</div>
			<CallHistory callHistory={callHistory} />
			<Script script={script} />
		</>
	);
}

export default InCall;
