import theme1 from '../Themes/bnw';

const Themes = new Map<string, Theme>();

Themes.set('bnw', { CSS: theme1, name: 'Noir et blanc' });

function getThemes() {
	return Themes.values();
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
export { getThemes, getTheme };
