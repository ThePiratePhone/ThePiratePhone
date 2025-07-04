import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CallEnd from '../Components/Call/CallEnd';
import InCall from '../Components/Call/InCall';
import OutOfHours from '../Components/Call/OutOfHours';
import { getCallingTime } from '../Utils/Storage';
import { isInHours } from '../Utils/Utils';

async function getNewClient(credentials: CredentialsV2): Promise<
	| {
			status: boolean;
			data:
				| {
						client: Client;
						script: string;
						status: Array<CallStatus>;
						callHistory: Array<Call>;
						campaignCallStart: number;
						campaignCallEnd: number;
				  }
				| undefined;
	  }
	| undefined
> {
	try {
		const result = await axios.post(credentials.URL + '/caller/getPhoneNumber', credentials);
		if (result) {
			if (result?.data?.OK) {
				return { status: true, data: result.data };
			} else {
				return { status: false, data: undefined };
			}
		} else {
			return undefined;
		}
	} catch (err: any) {
		if (err?.response?.data) {
			if (err.response.data?.OK) {
				return { status: false, data: err.response.data };
			} else {
				return { status: true, data: undefined };
			}
		} else {
			console.error(err);
			return undefined;
		}
	}
}

function Calling({
	credentials,
	campaign,
	setCampaign
}: {
	credentials: CredentialsV2;
	campaign: Campaign;
	setCampaign: (campaign: Campaign) => void;
}) {
	const [Page, setPage] = useState(<div className="CallingError">Récupération en cours...</div>);

	const client = useRef<Client>(undefined);

	const navigate = useNavigate();

	useEffect(() => {
		async function cancel() {
			try {
				await axios.post(credentials.URL + '/caller/giveUp', credentials);
				navigate('/');
			} catch (err: any) {
				if (err.response?.data?.message) {
					navigate('/');
				} else {
					console.error(err);
				}
			}
		}

		function getNextClient() {
			function next() {
				getNewClient(credentials).then(result => {
					if (typeof result != 'undefined') {
						if (result?.data?.client) {
							client.current = result.data.client;
							if (result.data?.campaignCallStart && result.data?.campaignCallEnd) {
								campaign.callHoursEnd = new Date(result.data.campaignCallEnd);
								campaign.callHoursStart = new Date(result.data.campaignCallStart);
								campaign.status = result.data.status;
								setCampaign(campaign);
							}
							if (!result.status) {
								endCall();
							} else {
								setPage(
									<InCall
										client={client.current}
										script={result.data.script}
										callHistory={result.data.callHistory}
										endCall={() => endCall()}
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

		function endCall() {
			if (client.current) {
				const time = getCallingTime();
				setPage(
					<CallEnd
						credentials={credentials}
						client={client.current}
						status={campaign.status}
						time={time ?? 0}
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
