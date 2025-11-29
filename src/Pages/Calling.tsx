import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CallEnd from '../Components/Call/CallEnd';
import InCall from '../Components/Call/InCall';
import OutOfHours from '../Components/Call/OutOfHours';
import { getCallingTime } from '../Utils/Storage';
import { isInHours } from '../Utils/Utils';

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
	const navigate = useNavigate();
	const client = useRef<Client>(undefined);

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

	function endCall() {
		if (client.current) {
			const time = getCallingTime();
			setPage(
				<CallEnd
					credentials={credentials}
					client={client.current}
					status={campaign.status}
					time={time ?? 0}
					nextCall={getNext}
				/>
			);
		}
	}

	function getNextClient() {
		axios
			.post(credentials.URL + '/caller/getPhoneNumber', credentials)
			.catch(error => {
				const message = error.response?.data?.message;
				if (!error.status) {
					endCall();
				}
				if (error.status == 403 && message == 'Call not permited, the end time has passed') {
					setPage(<div className="CallingError">la date de fin de campagne et passé</div>);
					return;
				} else if (error.status == 403 && message == 'Call not permited') {
					setPage(
						<div className="CallingError">les appel ne sont pas ou plus permis dans cette campagne</div>
					);
					return;
				} else if (error.status == 403) {
					setPage(<div className="CallingError">vous n'avez pas le droit d'appeler dans cette campagne</div>);
					return;
				} else if (error.status == 404 && message == 'Campaign not found or not active') {
					setPage(
						<div className="CallingError">
							vous n'avez plus le droit d'appeler dans cette campagne elle semble desactivé
						</div>
					);
					return;
				} else if (error.status == 404 && message == 'Client not found') {
					setPage(<div className="CallingError">hum il n'y a plus de client disponible</div>);
					return;
				} else if (error.status == 500) {
					setPage(<div className="CallingError">erreur serveur :/</div>);
					return;
				}
			})
			.then(nexClientResponse => {
				if (!nexClientResponse || !nexClientResponse.data) {
					setPage(<div className="CallingError">erreur de recuperation, donnée corompu :/</div>);
					return;
				}

				if (nexClientResponse.data?.campaignCallStart) {
					campaign.callHoursStart = new Date(nexClientResponse.data.campaignCallStart);
					campaign.status = nexClientResponse.data.status;
					setCampaign(campaign);
				}

				if (nexClientResponse.data?.endTime) {
					campaign.endTime = new Date(nexClientResponse.data.endTime);
					campaign.status = nexClientResponse.data.status;
					setCampaign(campaign);
				}

				setPage(
					<InCall
						client={nexClientResponse.data.client}
						script={nexClientResponse.data.script}
						priority={nexClientResponse.data.priority}
						callHistory={nexClientResponse.data.callHistory}
						campagneEnd={campaign.endTime || new Date()}
						endCall={() => endCall()}
						cancel={cancel}
					/>
				);
			});
	}
	function getNext() {
		if (!isInHours(campaign)) {
			setPage(<OutOfHours campaign={campaign} next={getNextClient} />);
			return;
		} else {
			getNextClient();
		}
	}
	useEffect(() => {
		getNext();
	}, [credentials]);

	return <div className="Calling">{Page}</div>;
}

export default Calling;
