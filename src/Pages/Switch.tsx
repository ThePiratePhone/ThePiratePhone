import { Link, useNavigate } from 'react-router-dom';

import Button from '../Components/Button';

function Switch({
	campaigns,
	setCredentials,
	switchCampaign,
	credentials
}: {
	campaigns: Array<Campaign>;
	setCredentials: (newCredentials: Credentials | CredentialsV2) => void;
	switchCampaign: (campaign: Campaign) => void;
	credentials: Credentials | CredentialsV2;
}) {
	const navigate = useNavigate();

	function click() {
		const campaignId = (document.getElementById('campaign') as HTMLInputElement).value;
		credentials.campaign = campaignId;
		const campaign = campaigns.find(val => val._id === campaignId) as Campaign;
		setCredentials(credentials);
		switchCampaign(campaign);
		navigate('/');
	}
	return (
		<div className="Dashboard">
			<h1>Changer d'organisation</h1>
			<select className="inputField" id="campaign" defaultValue={credentials.campaign}>
				{campaigns.map((campaign, i) => {
					return (
						<option key={i} value={campaign._id}>
							{campaign.name}
						</option>
					);
				})}
			</select>
			<Button value="Valider" onclick={click} />

			<Link to="/Join" className="JoinArea">
				L'organisation n'apparait pas ? Rejoignez-là <u>ici</u>.
			</Link>
		</div>
	);
}

export default Switch;
