import { JSX } from 'react';

import auroraurban from '../Themes/auroraurban';
import blackandwhite from '../Themes/blackandwhite';
import deepocean from '../Themes/deepocean';
import petrogradsun from '../Themes/petrogradsun';
import radiantreef from '../Themes/radiantreef';

const Themes = new Map<string, Theme>();

Themes.set('default', { CSS: {}, name: 'Classique' });
Themes.set('radiantreef', { CSS: radiantreef, name: 'Récif radieux' });
Themes.set('deepocean', { CSS: deepocean, name: 'Océan profond' });
Themes.set('auroraurban', { CSS: auroraurban, name: 'Aurore urbaine' });
Themes.set('petrogradsun', { CSS: petrogradsun, name: 'Soleil de Petrograd ☭' });
Themes.set('blackandwhite', { CSS: blackandwhite, name: 'Noir et blanc' });

function getThemes() {
	return Array.from(Themes, ([name, value]) => ({ name, value }));
}

function getTheme(themeId: string) {
	return Themes.get(themeId);
}

function ThemeProvider({ themeId, children }: { themeId: string; children: JSX.Element | JSX.Element[] }) {
	return (
		<div className="ThemeProvider" style={Themes.get(themeId)?.CSS}>
			{children}
		</div>
	);
}

export default ThemeProvider;
export { getTheme, getThemes };
