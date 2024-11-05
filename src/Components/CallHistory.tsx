function CallHistory({ callHistory }: { callHistory: Array<Call> }) {
	if (!callHistory?.length) return <div className="NoCall">Jamais appelé·e</div>;
	const values = callHistory.map(res => {
		res.start = new Date(res.start);
		return res;
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
								{res.start.toLocaleDateString()} - {res.start.toLocaleTimeString()}
							</span>
							) {res.satisfaction} {res.comment != null ? `(${res.comment})` : ''}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default CallHistory;
