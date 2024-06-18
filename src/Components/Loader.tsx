import { useEffect, useState } from 'react';

function Loader() {
	const [Content, setContent] = useState(<></>);

	useEffect(() => {
		setTimeout(() => {
			setContent(
				<div className="Loader">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 100 100"
						preserveAspectRatio="xMidYMid"
						width="200"
						height="200"
					>
						<circle
							strokeDasharray="136.659280431156 47.553093477052"
							r="29"
							strokeWidth="10"
							fill="none"
							cy="50"
							cx="50"
						></circle>
					</svg>
					Chargement...
				</div>
			);
		}, 500);
	});

	return Content;
}

export default Loader;
