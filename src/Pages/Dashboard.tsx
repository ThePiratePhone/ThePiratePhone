import axios from 'axios';
import { useEffect, useState } from 'react';

import Button from '../Components/Button';

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

function Dashboard({ credentials }: { credentials: Credentials }) {
	const [Progress, setProgress] = useState('');

	useEffect(() => {
		getProgress(credentials).then(vals => {
			if (typeof vals == 'string') {
				setProgress("Aucune campagne n'est en cours");
			} else if (vals) {
				if (vals.total === 0) {
					setProgress('Il ne semble avoir aucun numéro à appeler...');
				} else {
					setProgress('La progression est de ' + ((vals.count / vals.total) * 100).toFixed(0) + '%.');
				}
			} else {
				setProgress('Une erreur est survenue :/');
			}
		});
	}, [credentials]);

	return (
		<div className="Dashboard">
			<Button link="/Calling" value="Appeler" />
			<Button link="/Recall" value="Quelqu'un vous a rappelé ?" />

			<div className="Progress">{Progress}</div>
		</div>
	);
}

export default Dashboard;
