import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Components/Button';
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
	const [ButtonValue, setButtonValue] = useState('Récupération en cours...');
	const [ButtonDisabled, setButtonDisabled] = useState(true);
	const [AreasComp, setAreasComp] = useState(<></>);

	const navigate = useNavigate();

	function join(area: string, password: string) {
		return new Promise<Campaign | undefined>(resolve => {
			axios
				.post(credentials.URL + '/joinCampaign', {
					area: area,
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					campaignPassword: password
				})
				.then(response => {
					resolve(response.data.data);
				})
				.catch(err => {
					if (err.response.data.message) {
						if (err.response.data.message === 'Wrong campaign password') {
							setButtonValue('Clé invalide');
							setButtonDisabled(false);
						}
					} else {
						console.error(err);
						setButtonValue('Une erreur est survenue');
					}
					resolve(undefined);
				});
		});
	}

	function click() {
		if (ButtonDisabled) return;
		const area = (document.getElementById('area') as HTMLInputElement).value;
		const password = (document.getElementById('password') as HTMLInputElement).value;

		setButtonDisabled(true);
		setButtonValue('Vérification en cours...');

		join(area, password).then(newCampaign => {
			if (newCampaign) {
				credentials.area = newCampaign.areaId;
				setCredentials(credentials);
				addCampaign(newCampaign);
				if (next) {
					next();
				} else {
					navigate('/');
				}
			} else {
				setButtonValue('Une erreur est survenue');
				setButtonDisabled(false);
			}
		});
	}

	useEffect(() => {
		function getAreas() {
			return new Promise<Array<Area> | undefined>(resolve => {
				axios
					.get(credentials.URL + '/getArea')
					.then(response => {
						response.data.data = response.data.data.filter((area: Area) => {
							return !(areas.find(val => val.areaId == area._id) || area._id == credentials.area);
						});
						response.data.data = response.data.data.sort(areaSorter);
						resolve(response.data.data);
					})
					.catch(err => {
						console.error(err);
						resolve(undefined);
					});
			});
		}

		getAreas().then(res => {
			if (res) {
				setAreas(res);
				setButtonValue('Rejoindre');
				setButtonDisabled(false);
			} else {
				setButtonValue('Une erreur est survenue');
			}
		});
	}, [areas]);

	function change() {
		if (ButtonValue === 'Rejoindre') return;
		setButtonValue('Rejoindre');
	}

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
				disabled={ButtonDisabled}
				className="inputField"
				id="password"
				type="password"
				onChange={change}
				onKeyUp={enter}
				placeholder="Clé d'organisation"
			/>
			<Button value={ButtonValue} type={ButtonDisabled ? 'ButtonDisabled' : ''} onclick={click} />
		</div>
	);
}

export default Join;
