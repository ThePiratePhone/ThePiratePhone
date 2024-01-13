import axios from 'axios';
import { useEffect, useState } from 'react';

import User from '../Components/User';

async function getNewClient(): Promise<User | undefined> {
	return {
		name: 'Person 1',
		number: '+33123456789',
		callStatus: 'Todo',
		callEnd: undefined,
		callerNumber: undefined,
		callStart: undefined,
		scriptVersion: undefined
	};
	return new Promise(resolve => {
		axios
			.post(process.env.URL + '/', {})
			.then(result => {
				if (result) {
					resolve(result.data.user);
				} else {
					resolve(undefined);
				}
			})
			.catch(() => {
				resolve(undefined);
			});
	});
}

function Calling() {
	const [user, setUser] = useState(<></>);

	useEffect(() => {
		getNewClient().then(result => {
			if (typeof result != 'undefined') {
				setUser(<User user={result} />);
			} else {
				setUser(<div>Une erreur est survenue :/</div>);
			}
		});
	}, [setUser]);

	return (
		<div className="Calling">
			<h2>Prochain contact</h2>
			{user}
		</div>
	);
}

export default Calling;
