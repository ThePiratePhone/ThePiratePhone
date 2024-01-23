import axios from 'axios';
import { useEffect, useState } from 'react';

import NavButton from '../Components/Button';

import Phone from '../Assets/Phone.svg';

const URL = 'https:	//dfg.freeboxos.fr:7000/api';

function getProgress(credentials: Credentials) {
	return new Promise<Array<number> | false>(resolve => {
		axios
			.post(URL + '/getProgress', credentials)
			.then(response => resolve(response.data.data))
			.catch(err => {
				console.error(err);
				resolve(false);
			});
	});
}

function Dashboard({ caller, credentials }: { caller: Caller; credentials: Credentials }) {
	const [Progress, setProgress] = useState<string>('');

	useEffect(() => {
		getProgress(credentials).then(vals => {
			if (vals) {
				setProgress(
					'La progression est de ' + vals[0] / vals[1] + '%. Il reste ' + (vals[1] - vals[0]) + ' numéros.'
				);
			} else {
				setProgress('Une erreur est survenue :/');
			}
		});
	}, [credentials]);

	console.log('Here !');

	return (
		<div className="Dashboard">
			<h1>Bienvenue, {caller.name}</h1>
			{Progress}
			<NavButton link="calling" image={Phone} value="Appeler" />
		</div>
	);
}

export default Dashboard;
