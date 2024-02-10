import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import { CallEndMobile, InCallMobile, NextCallMobile } from '../Components/CallingComponents';

const URL = 'https://cs.mpqa.fr:7000/api';

async function getNewClient(
	credentials: Credentials
): Promise<{ status: boolean; data: { client: User; script: string } | undefined } | undefined> {
	return new Promise(resolve => {
		axios
			.post(URL + '/getPhoneNumber', credentials)
			.then(result => {
				if (result) {
					if (result?.data?.OK) {
						resolve({ status: true, data: result.data.data });
					} else {
						resolve({ status: false, data: undefined });
					}
				} else {
					resolve(undefined);
				}
			})
			.catch(err => {
				if (err?.response?.data) {
					if (err.response.data?.OK) {
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
		function getNextClient() {
			getNewClient(credentials).then(result => {
				const time = Date.now();
				if (typeof result != 'undefined') {
					if (result.data) {
						client.current = result.data.client;
						if (!result.status) {
							endCall();
						} else {
							setPage(
								<InCallMobile
									client={client.current}
									script={result.data.script}
									endCall={() => endCall(time)}
								/>
							);
						}
					} else {
						if (result.status) {
							setPage(<div className="CallingError">La liste est vide !</div>);
						} else {
							setPage(<div className="CallingError">Aucune campagne n'est en cours</div>);
						}
					}
				} else {
					setPage(<div className="CallingError">Une erreur est survenue :/</div>);
				}
			});
		}

		function nextCall() {
			setPage(<NextCallMobile newCall={getNextClient} />);
		}

		function endCall(startTime?: number) {
			if (client.current) {
				setPage(
					<CallEndMobile
						credentials={credentials}
						client={client.current}
						time={startTime ? Date.now() - startTime : 0}
						nextCall={nextCall}
					/>
				);
			}
		}

		getNextClient();
	}, [credentials]);

	return <div className="Calling">{Page}</div>;
}

function CallingDesktop() {
	return <div className="Calling">WIP...</div>;
}

function Calling({ credentials, isMobile }: { credentials: Credentials; isMobile: boolean }) {
	return isMobile ? <CallingMobile credentials={credentials} /> : <CallingDesktop />;
}

export default Calling;
