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
					<span className="Phone">{vals.totalClientCalled}</span> sur{' '}
					<span className="Phone">{vals.totalClientCalled}</span>.
				</>
			);
		}
		if (vals.totalClientCalled == 1) {
			setProgress(
				<>
					<span className="Phone">1</span> appel effectué.
				</>
			);
		} else if (vals.totalClientCalled < 5) {
			setProgress(
				<>
					<span className="Phone">{vals.totalClientCalled}</span> appels effectués.
				</>
			);
		} else if (vals.totalClientCalled < 20) {
			setProgress(
				<>
					Déjà <span className="Phone">{vals.totalClientCalled}</span> coups de fil passés ?
				</>
			);
		} else if (vals.totalClientCalled < 50) {
			setProgress(
				<>
					<span className="Phone">{vals.totalClientCalled}</span> appels ! Ça monte vite !
				</>
			);
		} else if (vals.totalClientCalled < 100) {
			setProgress(
				<>
					Oh là là. Mon compteur affiche <span className="Phone">{vals.totalClientCalled}</span> appels !
				</>
			);
		} else if (vals.totalClientCalled < 150) {
			setProgress(
				<>
					<span className="Phone">{vals.totalClientCalled}</span> appels ! Encore encore encore !
				</>
			);
		} else if (vals.totalClientCalled < 250) {
			setProgress(
				<>
					<span className="Phone">{vals.totalClientCalled}</span> coups de fil !? On croit en vous ! 🫶
				</>
			);
		} else if (vals.totalClientCalled < 350) {
			setProgress(
				<>
					Allez allez ! <span className="Phone">{vals.totalClientCalled}</span> appels ! On fait brûler Free !
				</>
			);
		} else {
			setProgress(
				<>
					Woah. <span className="Phone">{vals.totalClientCalled}</span> appels ! Ça s'arrête jamais...
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
