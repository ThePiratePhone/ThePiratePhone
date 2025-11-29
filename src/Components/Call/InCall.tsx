import { useState } from 'react';
import { cleanNumber } from '../../Utils/Cleaners';
import { saveCallingTime } from '../../Utils/Storage';
import Button from '../Button';
import CallHistory from './CallHistory';
import Script from './Script';
import Timer from '../utils/timer';

function InCall({
	client,
	script,
	priority,
	callHistory,
	campagneEnd,
	endCall,
	cancel
}: {
	client: Client;
	script: string;
	priority: string;
	callHistory: Array<Call>;
	campagneEnd: Date;
	endCall: () => void;
	cancel: () => void;
}) {
	saveCallingTime();

	const [infoTab, setInfoTab] = useState(false);
	const [campagneTab, setCampagneTab] = useState(false);
	const [scriptTab, setScriptTab] = useState(true);

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
			<div className="tabPanels">
				<h3 className="tabPanelsTitle" onClick={() => setInfoTab(!infoTab)}>
					Info
				</h3>
				<article className={infoTab ? 'activePanel' : ''}>
					<CallHistory callHistory={callHistory} />
				</article>
				<h3 className="tabPanelsTitle" onClick={() => setCampagneTab(!campagneTab)}>
					Campagne
				</h3>
				<article className={campagneTab ? 'activePanel' : ''}>
					<Timer deadline={campagneEnd}></Timer>
				</article>
				<h3 className="tabPanelsTitle" onClick={() => setScriptTab(!scriptTab)}>
					Script
				</h3>
				<article className={scriptTab ? 'activePanel' : ''}>
					<Script script={script} />
				</article>
			</div>
		</>
	);
}

export default InCall;
