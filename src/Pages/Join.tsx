import axios from 'axios';
import { useEffect, useState } from 'react';

import Button from '../Components/Button';
import { useNavigate } from 'react-router-dom';

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
					useNavigate()('/');
				}
			}
		});
	}

	useEffect(() => {
		function getArea() {
			return new Promise<Array<Area> | undefined>(resolve => {
				axios
					.get(credentials.URL + '/getArea')
					.then(response => {
						response.data.data = response.data.data.filter((area: Area) => {
							return !(areas.find(val => val.areaId == area._id) || area._id == credentials.area);
						});
						response.data.data = response.data.data.sort((a: Area, b: Area) => {
							if (a.name > b.name) {
								return 1;
							} else if (a.name < b.name) {
								return -1;
							}
							return 0;
						});
						resolve(response.data.data);
					})
					.catch(err => {
						console.error(err);
						resolve(undefined);
					});
			});
		}

		getArea().then(res => {
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

	function enter(e: any) {
		if (e.key === 'Enter') {
			click();
		}
	}

	useEffect(() => {
		if (!Areas) {
			setAreasComp(<></>);
			return;
		}
		if (Areas.length === 0) {
			setAreasComp(<h2>Vous êtes dans toutes les organisations ??? Beau travail...</h2>);
			setButtonDisabled(true);
			return;
		}
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
