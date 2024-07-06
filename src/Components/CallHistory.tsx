import { cleanSatisfaction } from '../Utils/Cleaners';

function CallHistory({
	client,
	campaign,
	callhistory
}: {
	client: Client;
	callhistory: Array<Call>;
	campaign: Campaign;
}) {
	if (callhistory.length == 0) return <div className="NoCall">Jamais appelé·e</div>;
	const values = new Array<{
		status: CallStatus;
		satisfaction: Satisfaction;
		comment: string | undefined;
		startCall: Date;
	}>();
	callhistory.forEach((res, i) => {
		if (i == callhistory.length - 1) return; // not sure, only if is an recovery call
		res.start = new Date(res.start);
		values.push({
			status: res.status,
			satisfaction: res.satisfaction,
			comment: res?.comment ?? undefined,
			startCall: res.start
		});
	});
	if (values.length == 0) {
		return <div className="NoCall">Jamais appelé·e</div>;
	}

	return (
		<div className="CallHistory">
			<h3>Historique d'appel</h3>
			<div>
				{values.map((res, i) => {
					return (
						<div key={i}>
							<span className="Phone">{i + 1}</span>. (
							<span className="Phone">
								{res.startCall.toLocaleDateString()} - {res.startCall.toLocaleTimeString()}
							</span>
							) {cleanSatisfaction(res.satisfaction)} {res.comment ? `(${res.comment})` : ''}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default CallHistory;
