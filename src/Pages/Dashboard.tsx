import axios from 'axios';
import { useEffect, useState } from 'react';

import Button from '../Components/Button';

function getProgress(credentials: Credentials): Promise<ProgressResponse | string> {
	return new Promise(resolve => {
		axios
			.post(credentials.URL + '/getProgress', credentials)
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
	const [Progress, setProgress] = useState(<></>);

	function DynamicProgress(vals: string | ProgressResponse) {
		if (typeof vals == 'string') {
			setProgress(<>Aucune campagne n'est en cours.</>);
			return;
		}
		if (!vals) {
			setProgress(<>Une erreur est survenue :/</>);
			return;
		}
		if (vals.totalUser === 0) {
			setProgress(<>Il n'y a aucun numéro dans votre campagne.</>);
			return;
		}
		if (vals.totalDiscution - vals.totalUser === 0) {
			setProgress(
				<>
					<span className="PhoneNumber">{vals.totalClientCalled}</span> sur{' '}
					<span className="PhoneNumber">{vals.totalClientCalled}</span>.
				</>
			);
		}
		if (vals.totalClientCalled < 5) {
			setProgress(
				<>
					<span className="PhoneNumber">{vals.totalClientCalled}</span> appels effectués.
				</>
			);
		} else if (vals.totalClientCalled < 20) {
			setProgress(
				<>
					Déjà <span className="PhoneNumber">{vals.totalClientCalled}</span> coups de fils passés ?
				</>
			);
		} else if (vals.totalClientCalled < 50) {
			setProgress(
				<>
					<span className="PhoneNumber">{vals.totalClientCalled}</span> appels ! Ça monte vite !
				</>
			);
		} else if (vals.totalClientCalled < 100) {
			setProgress(
				<>
					Oh la la. Mon compteur affiche <span className="PhoneNumber">{vals.totalClientCalled}</span> appels
					!
				</>
			);
		} else if (vals.totalClientCalled < 150) {
			setProgress(
				<>
					<span className="PhoneNumber">{vals.totalClientCalled}</span>! Encore encore encore !
				</>
			);
		} else {
			setProgress(
				<>
					Woah. <span className="PhoneNumber">{vals.totalClientCalled}</span>! Ça s'arrête jamais...
				</>
			);
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
