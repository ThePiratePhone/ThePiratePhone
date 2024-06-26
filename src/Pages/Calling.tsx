import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CallEnd from '../Components/CallEnd';
import InCall from '../Components/InCall';
import OutOfHours from '../Components/OutOfHours';
import { getCallingTime } from '../Utils/Storage';
import { isInHours } from '../Utils/Utils';

async function getNewClient(credentials: Credentials): Promise<
	| {
			status: boolean;
			data: { client: Client; script: string; CampaignCallStart: number; CampaignCallEnd: number } | undefined;
	  }
	| undefined
> {
	try {
		const result = await axios.post(credentials.URL + '/getPhoneNumber', credentials);
		if (result) {
			if (result?.data?.OK) {
				const campaignId = Object.keys(result.data.data.client.data)[0];
				result.data.data.client.data[campaignId] = result?.data?.data?.client?.data[campaignId]?.map(
					(val: { status: string }) => {
						let status: CallStatus;
						if (val.status == 'called') status = 'Called';
						else if (val.status == 'not called') status = 'Todo';
						else if (val.status == 'inprogress') status = 'Calling';
						else status = 'Not responded';
						val.status = status;
						return val;
					}
				);
				return { status: true, data: result.data.data };
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
	credentials: Credentials;
	campaign: Campaign;
	setCampaign: (campaign: Campaign) => void;
}) {
	const [Page, setPage] = useState(<div className="CallingError">Récupération en cours...</div>);

	const client = useRef<Client>();

	const navigate = useNavigate();

	useEffect(() => {
		async function cancel() {
			try {
				await axios.post(credentials.URL + '/giveUp', {
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					area: credentials.area
				});
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
										endCall={() => endCall()}
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

		function endCall() {
			if (client.current) {
				const time = getCallingTime();
				setPage(
					<CallEnd
						credentials={credentials}
						client={client.current}
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
