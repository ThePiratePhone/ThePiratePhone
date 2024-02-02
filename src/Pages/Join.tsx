import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URL = 'https://dfg.freeboxos.fr:7000/api';

function Join({
	credentials,
	setCredentials,
	addArea,
	areas
}: {
	credentials: Credentials;
	setCredentials: (newCredentials: Credentials) => void;
	addArea: (newArea: AreaCombo) => void;
	areas: Array<AreaCombo>;
}) {
	const [Areas, setAreas] = useState<Array<Area> | undefined>();
	const [ButtonValue, setButtonValue] = useState('Récupération en cours...');
	const [ButtonDisabled, setButtonDisabled] = useState(true);
	const [AreasComp, setAreasComp] = useState(<></>);

	const navigate = useNavigate();

	function join(area: string, password: string) {
		return new Promise<AreaCombo | undefined>(resolve => {
			axios
				.post(URL + '/joinCampaign', {
					area: area,
					phone: credentials.phone,
					pinCode: credentials.pinCode,
					campaignPassword: password
				})
				.then(response => {
					resolve(response.data.data);
				})
				.catch(err => {
					if (err.response.data.data) {
						const message = err.response.data.data;
						if (message === 'Wrong campaign password') {
							setButtonValue('Clé invalide');
						} else {
							setButtonValue(message);
						}
					} else {
						console.error(err);
						setButtonValue('Une erreur est survenue');
					}
					setButtonDisabled(false);
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

		join(area, password).then(newAreaCombo => {
			if (newAreaCombo) {
				credentials.area = newAreaCombo.areaId;
				setCredentials(credentials);
				addArea(newAreaCombo);
				navigate('/');
			} else {
				setButtonValue('Clé invalide');
				setButtonDisabled(false);
			}
		});
	}

	useEffect(() => {
		function getArea() {
			return new Promise<Array<Area> | undefined>(resolve => {
				axios
					.get(URL + '/getArea')
					.then(response => {
						response.data.data = response.data.data.filter((area: Area) => {
							if (areas.find(val => val.areaId === area._id)) {
								return false;
							} else {
								return true;
							}
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
			<select className="JoinSelect" id="area">
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
			<h1>Joindre une organisation</h1>
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
			<div className="NavButton" onClick={click}>
				<button className={ButtonDisabled ? 'ButtonDisabled' : ''} disabled={ButtonDisabled}>
					{ButtonValue}
				</button>
			</div>
		</div>
	);
}

export default Join;
