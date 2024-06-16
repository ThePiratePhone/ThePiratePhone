import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CallEnd from '../Components/CallEnd';
import InCall from '../Components/InCall';
import OutOfHours from '../Components/OutOfHours';
import { isInHours } from '../Utils/Utils';

async function getNewClient(credentials: Credentials): Promise<
	| {
			status: boolean;
			data: { client: Client; script: string; CampaignCallStart: number; CampaignCallEnd: number } | undefined;
	  }
	| undefined
> {
	return new Promise(resolve => {
		axios
			.post(credentials.URL + '/getPhoneNumber', credentials)
			.then(result => {
				if (result) {
					if (result?.data?.OK) {
						const campaignId = Object.keys(result.data.data.client.data)[0];
						result.data.data.client.data[campaignId] = result?.data?.data?.client?.data[campaignId]?.map(
							(val: any) => {
								let status: CallStatus;
								if (val.status == 'called') status = 'Called';
								else if (val.status == 'not called') status = 'Todo';
								else if (val.status == 'inprogress') status = 'Calling';
								else status = 'Not responded';
								val.status = status;
								return val;
							}
						);
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

function Calling({
	credentials,
	campaign,
	setCampaign
}: {
	credentials: Credentials;
	campaign: Campaign;
	setCampaign: (campaign: Campaign) => void;
}) {
	const [Page, setPage] = useState(<div className="CallingError">Récupération en cours...</div>);

	const client = useRef<Client>();

	const navigate = useNavigate();

	useEffect(() => {
		async function cancel() {
			axios
				.post(credentials.URL + '/giveUp', {
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					area: credentials.area
				})
				.then(() => navigate('/'))
				.catch(err => {
					if (err.response?.data?.message) {
						navigate('/');
					} else {
						console.error(err);
					}
				});
		}

		function getNextClient() {
			function next() {
				getNewClient(credentials).then(result => {
					const time = Date.now();
					if (typeof result != 'undefined') {
						if (result.data) {
							client.current = result.data.client;
							if (result?.data?.CampaignCallStart && result?.data?.CampaignCallEnd) {
								campaign.callHoursEnd = new Date(result.data.CampaignCallEnd);
								campaign.callHoursStart = new Date(result.data.CampaignCallStart);
								setCampaign(campaign);
							}
							if (!result.status) {
								endCall();
							} else {
								setPage(
									<InCall
										client={client.current}
										script={result.data.script}
										endCall={() => endCall(time)}
										campaign={campaign}
										cancel={cancel}
									/>
								);
							}
						} else {
							if (result.status) {
								setPage(<div className="CallingError">Aucun numéro disponible</div>);
							} else {
								setPage(<div className="CallingError">Aucune campagne n'est en cours</div>);
							}
						}
					} else {
						setPage(<div className="CallingError">Une erreur est survenue :/</div>);
					}
				});
			}
			if (!isInHours(campaign)) {
				setPage(<OutOfHours campaign={campaign} next={next} />);
				return;
			} else {
				next();
			}
		}

		function endCall(startTime?: number) {
			if (client.current) {
				setPage(
					<CallEnd
						credentials={credentials}
						client={client.current}
						time={startTime ? Date.now() - startTime : 0}
						nextCall={getNextClient}
					/>
				);
			}
		}

		getNextClient();
	}, [credentials]);

	return <div className="Calling">{Page}</div>;
}

export default Calling;
