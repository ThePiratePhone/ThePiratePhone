import Button from '../Button';

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

export default OutOfHours;
