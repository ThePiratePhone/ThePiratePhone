import axios from 'axios';
import { useEffect, useState } from 'react';

import Button from '../Components/Button';
import { getRandom } from '../Utils/Utils';

function getCallString(calls: number) {
	const VALUES = [
		<>
			<span className="Phone">{calls}</span> appels effectués.
		</>,
		<>
			<span className="Phone">{calls}</span> coups de fil passés ?
		</>,
		<>
			<span className="Phone">{calls}</span> appels ! Ça monte vite !
		</>,
		<>
			Oh là là. Mon compteur affiche <span className="Phone">{calls}</span> appels !
		</>,
		<>
			<span className="Phone">{calls}</span> appels ! Encore encore encore !
		</>,
		<>
			<span className="Phone">{calls}</span> coups de fil !? On croit en vous !
		</>,
		<>
			Allez allez ! <span className="Phone">{calls}</span> appels ! On fait brûler Free !
		</>,
		<>
			Woah. <span className="Phone">{calls}</span> appels ! Ça s'arrête jamais...
		</>,
		<>
			Déjà <span className="Phone">{calls}</span> appels ? Pas mal du tout.
		</>
	];

	return VALUES[getRandom(0, VALUES.length - 1)];
}

async function getProgress(credentials: Credentials | CredentialsV2): Promise<ProgressResponse | string | undefined> {
	try {
		return (await axios.post(credentials.URL + '/caller/getProgress', credentials)).data.data;
	} catch (err: any) {
		if (err?.response?.data?.message) {
			return err.response.data.message;
		} else {
			console.error(err);
			return undefined;
		}
	}
}

function Dashboard({ credentials }: { credentials: Credentials | CredentialsV2 }) {
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
			setProgress(<>Il n'y a aucun numéro dans cette campagne.</>);
			return;
		}
		if (vals.totalCall <= 15) {
			setProgress(
				<>
					{vals.totalCall == 1 ? (
						<>
							<span className="Phone">1</span> appel effectué
						</>
					) : (
						<>
							<span className="Phone">{vals.totalCall}</span> appels effectués
						</>
					)}
					.
				</>
			);
		} else if (vals.totalCall == 1312) {
			setProgress(
				<>
					<span className="Phone">{vals.totalCall}</span> appels ! Nombre magique ! Il portera chance lors du
					prochain appel !
				</>
			);
		} else {
			setProgress(getCallString(vals.totalCall));
		}
	}

	useEffect(() => {
		getProgress(credentials).then(res => {
			if (res) {
				DynamicProgress(res);
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
