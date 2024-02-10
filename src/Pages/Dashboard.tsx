import axios from 'axios';
import { useEffect, useState } from 'react';

import NavButton from '../Components/Button';

import Phone from '../Assets/Phone.svg';
import { Link } from 'react-router-dom';

const URL = 'https://cs.mpqa.fr:7000/api';

function getProgress(credentials: Credentials): Promise<ProgressResponse | string> {
	return new Promise(resolve => {
		axios
			.post(URL + '/getProgress', credentials)
			.then(response => resolve(response.data.data))
			.catch(err => {
				if (err?.response?.data?.message) {
					resolve(err.response.data.message);
				} else {
					console.error(err);
					resolve(undefined);
				}
			});
	});
}

function MobileDashboard({
	caller,
	credentials,
	campaign
}: {
	caller: Caller;
	credentials: Credentials;
	campaign: Campaign;
}) {
	const [Progress, setProgress] = useState('');

	useEffect(() => {
		getProgress(credentials).then(vals => {
			if (typeof vals == 'string') {
				setProgress("Aucune campagne n'est en cours");
			} else if (vals) {
				if (vals.total === 0) {
					setProgress('Il ne semble avoir aucun numéro à appeler...');
				} else {
					setProgress(
						'La progression est de ' +
							((vals.count / vals.total) * 100).toFixed(0) +
							'%. Il reste ' +
							(vals.total - vals.count) +
							' numéros.'
					);
				}
			} else {
				setProgress('Une erreur est survenue :/');
			}
		});
	}, [credentials]);

	return (
		<div className="Dashboard">
			<h1>Bienvenue, {caller.name}</h1>
			<div className="MobileProgress">{Progress}</div>
			<NavButton link="/Calling" image={Phone} value="Appeler" />
			<NavButton link="/Recall" value="Quelqu'un vous a rappelé ?" />

			<Link to="/Switch" className="AreaSelector">
				Vous opérez sur
				<h2>
					{campaign.areaName}: {campaign.name}.
				</h2>
				Cliquez pour le changer
			</Link>
		</div>
	);
}

function DesktopDashboard({ caller, credentials }: { caller: Caller; credentials: Credentials }) {
	const [Progress, setProgress] = useState<string>('');

	useEffect(() => {
		getProgress(credentials).then(vals => {
			if (vals && !isNaN(vals[0])) {
				setProgress(
					'La progression est de ' +
						((vals[0] / vals[1]) * 100).toFixed(0) +
						'%. Il reste ' +
						(vals[1] - vals[0]) +
						' numéros.'
				);
			} else {
				setProgress('Une erreur est survenue :/');
			}
		});
	}, [credentials]);

	return (
		<div className="Dashboard">
			<h1>Bienvenue, {caller.name}</h1>
			{Progress}
			<NavButton link="/Calling" image={Phone} value="Appeler" />
		</div>
	);
}

function Dashboard({
	caller,
	credentials,
	isMobile,
	campaign
}: {
	caller: Caller;
	credentials: Credentials;
	isMobile: boolean;
	campaign: Campaign;
}) {
	return isMobile ? (
		<MobileDashboard campaign={campaign} caller={caller} credentials={credentials} />
	) : (
		<DesktopDashboard caller={caller} credentials={credentials} />
	);
}

export default Dashboard;
