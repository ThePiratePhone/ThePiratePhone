import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Components/Button';
import { getThemes } from '../Components/ThemeProvider';

function ChangeTheme({ Theme, setTheme }: { Theme: string; setTheme: (themeID: string) => void }) {
	const themes = getThemes();
	const navigate = useNavigate();
	const oldTheme = useRef(Theme ?? 'default');

	function change() {
		const themeID = (document.getElementById('theme') as HTMLInputElement).value;
		setTheme(themeID);
		window.localStorage.setItem('theme', JSON.stringify(themeID));
	}

	function cancel() {
		setTheme(oldTheme.current);
		navigate('/Account');
	}

	function click() {
		change();
		navigate('/Account');
	}

	return (
		<div className="Dashboard">
			<h1>Changement de thème</h1>
			<select className="inputField" id="theme" onChange={change}>
				{themes.map((area, i) => {
					return (
						<option key={i} value={area.name}>
							{area.value.name}
						</option>
					);
				})}
			</select>
			<Button value="Valider" onclick={click} />
			<Button value="Annuler" type="RedButton" onclick={cancel} />
		</div>
	);
}

export default ChangeTheme;
