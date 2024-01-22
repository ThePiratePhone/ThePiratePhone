import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import { CallEndMobile, InCallMobile } from '../Components/CallingComponents';

const URL = 'https:	//dfg.freeboxos.fr:7000/api';

async function getNewClient(
	credentials: Credentials
): Promise<{ status: boolean; data: { client: User; script: string } | undefined } | undefined> {
	return new Promise(resolve => {
		axios
			.post(URL + '/getPhoneNumber', credentials)
			.then(result => {
				if (result) {
					resolve({ status: true, data: result.data.data });
				} else {
					resolve(undefined);
				}
			})
			.catch(err => {
				if (err?.response?.data) {
					if (err.response.data.message?.OK) {
						resolve({ status: false, data: err.response.data });
					} else {
						resolve({ status: true, data: undefined });
					}
				} else {
					console.error(err);
					resolve(undefined);
				}
			});
	});
}

function CallingMobile({ credentials }: { credentials: Credentials }) {
	const [Page, setPage] = useState(<div className="CallingError">Récupération en cours...</div>);

	const client = useRef<User>();

	useEffect(() => {
		const time = Date.now();

		function endCall() {
			if (client.current) {
				setPage(<CallEndMobile credentials={credentials} client={client.current} time={Date.now() - time} />);
			}
		}

		getNewClient(credentials).then(result => {
			if (typeof result != 'undefined') {
				if (result.data) {
					client.current = result.data.client;
					if (!result.status) {
						setPage(<CallEndMobile credentials={credentials} client={client.current} time={0} />);
					} else {
						setPage(<InCallMobile client={client.current} script={result.data.script} endCall={endCall} />);
					}
				} else {
					setPage(<div>La liste est vide !</div>);
				}
			} else {
				setPage(<div className="CallingError">Une erreur est survenue :/</div>);
			}
		});
	}, [credentials]);

	return <div className="Calling">{Page}</div>;
}

export default CallingMobile;
