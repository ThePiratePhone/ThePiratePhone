import axios from 'axios';
import { useEffect, useState } from 'react';

import NavButton from '../Components/Button';

import Phone from '../Assets/Phone.svg';

const URL = 'https://dfg.freeboxos.fr:7000/api';

function getProgress(credentials: Credentials): Promise<ProgressResponse> {
	return new Promise(resolve => {
		axios
			.post(URL + '/getProgress', credentials)
			.then(response => resolve(response.data.data))
			.catch(err => {
				console.error(err);
				resolve(undefined);
			});
	});
}

function MobileDashboard({ caller, credentials }: { caller: Caller; credentials: Credentials }) {
	const [Progress, setProgress] = useState('');

	useEffect(() => {
		getProgress(credentials).then(vals => {
			if (vals) {
				setProgress(
					'La progression est de ' +
						((vals.count / vals.total) * 100).toFixed(0) +
						'%. Il reste ' +
						(vals.total - vals.count) +
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
			<div className="MobileProgress">{Progress}</div>
			<NavButton link="calling" image={Phone} value="Appeler" />
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
			<NavButton link="calling" image={Phone} value="Appeler" />
		</div>
	);
}

function Dashboard({ caller, credentials, isMobile }: { caller: Caller; credentials: Credentials; isMobile: boolean }) {
	return isMobile ? (
		<MobileDashboard caller={caller} credentials={credentials} />
	) : (
		<DesktopDashboard caller={caller} credentials={credentials} />
	);
}

export default Dashboard;
