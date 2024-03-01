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

	function DynamicProgress(vals: string | ProgressResponse) {
		if (typeof vals == 'string') {
			setProgress("Aucune campagne n'est en cours.");
			return;
		}
		if (!vals) {
			setProgress('Une erreur est survenue :/');
			return;
		}
		if (vals.total === 0) {
			setProgress("Il n'y a aucun numéro dans votre campagne.");
			return;
		}
		if (vals.count - vals.total === 0) {
			setProgress(vals.count + ' sur ' + vals.count + '.');
		}
		if (vals.count < 5) {
			setProgress(vals.count + ' appels effectués.');
		} else if (vals.count < 20) {
			setProgress('Déjà ' + vals.count + ' coups de fils passés ?');
		} else if (vals.count < 50) {
			setProgress(vals.count + ' appels ! Ça monte vite !');
		} else if (vals.count < 100) {
			setProgress('Oh la la. Mon compteur affiche ' + vals.count + ' appels !');
		} else if (vals.count < 150) {
			setProgress(vals.count + ' ! Encore encore encore !');
		} else {
			setProgress('Woah. ' + vals.count + "! Ça s'arrête jamais...");
		}
	}

	useEffect(() => {
		getProgress(credentials).then(DynamicProgress);
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
