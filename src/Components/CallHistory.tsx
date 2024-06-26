import { cleanSatisfaction } from '../Utils/Cleaners';

function CallHistory({ client, campaign }: { client: Client; campaign: Campaign }) {
	if (!client.data[campaign._id]) return <div className="NoCall">Jamais appelé·e</div>;
	const values = new Array<{
		status: CallStatus;
		satisfaction: Satisfaction;
		comment: string | undefined;
		startCall: Date;
	}>();
	client.data[campaign._id].forEach((res, i) => {
		if (res.status == 'Todo') return;
		if (i == client.data[campaign._id].length - 1) return;
		res.startCall = new Date(res.startCall);
		values.push(res);
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
