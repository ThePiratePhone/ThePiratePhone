import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Components/Button';
import Loader from '../Components/Loader';
import { areaSorter } from '../Utils/Sorters';

function Join({
	credentials,
	setCredentials,
	addCampaign,
	areas,
	next
}: {
	credentials: Credentials;
	setCredentials: (newCredentials: Credentials) => void;
	addCampaign: (newCampaign: Campaign) => void;
	areas: Array<Campaign>;
	next?: () => void;
}) {
	const [Areas, setAreas] = useState<Array<Area> | undefined>();
	const [Loading, setLoading] = useState(false);
	const [ErrorMessage, setErrorMessage] = useState<string | null>(null);
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [AreasComp, setAreasComp] = useState(<></>);

	async function join(area: string, password: string): Promise<Campaign | undefined> {
		try {
			return (
				await axios.post(credentials.URL + '/joinCampaign', {
					area: area,
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					campaignPassword: password
				})
			).data.data;
		} catch (err: any) {
			if (err.response.data.message === 'Wrong campaign password') {
				setErrorMessage('Clé invalide');
			} else {
				console.error(err);
				setErrorMessage('Une erreur est survenue');
			}
			setLoading(false);
			return undefined;
		}
	}

	function click() {
		if (ButtonDisabled) return;

		const area = (document.getElementById('area') as HTMLInputElement).value;
		const password = (document.getElementById('password') as HTMLInputElement).value;

		setLoading(true);

		join(area, password).then(newCampaign => {
			if (newCampaign) {
				credentials.area = newCampaign.areaId;
				setCredentials(credentials);
				addCampaign(newCampaign);
				if (next) {
					next();
				} else {
					useNavigate()('/');
				}
			}
			setLoading(false);
		});
	}

	useEffect(() => {
		async function getAreas(): Promise<Array<Area> | undefined> {
			try {
				const response = await axios.get(credentials.URL + '/getArea');

				response.data.data = response.data.data.filter((area: Area) => {
					return !(areas.find(val => val.areaId == area._id) || area._id == credentials.area);
				});
				response.data.data = response.data.data.sort(areaSorter);
				return response.data.data;
			} catch (err: any) {
				console.error(err);
				return undefined;
			}
		}

		getAreas().then(res => {
			if (res) {
				setAreas(res);
			}
			setLoading(false);
		});
	}, [areas]);

	function enter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			click();
		}
	}

	useEffect(() => {
		if (!Areas) {
			setAreasComp(<></>);
		} else if (Areas.length === 0) {
			setAreasComp(<h3>Vous êtes déjà dans toutes les organisations !</h3>);
			setButtonDisabled(true);
		} else {
			setAreasComp(
				<select className="inputField" id="area">
					{Areas.map((area, i) => {
						return (
							<option key={i} value={area._id}>
								{area.name}
							</option>
						);
					})}
				</select>
			);
		}
	}, [Areas]);

	return (
		<div className="Dashboard">
			<h1>Rejoindre une organisation</h1>
			{AreasComp}
			<input
				className="inputField"
				id="password"
				type="password"
				onKeyUp={enter}
				placeholder="Clé d'organisation"
			/>
			{ErrorMessage ?? ''}
			<Button type={ButtonDisabled ? 'ButtonDisabled' : undefined} value="Rejoindre" onclick={click} />
			{Loading ? <Loader /> : <></>}
		</div>
	);
}

export default Join;
