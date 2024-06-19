import axios from 'axios';
import { useEffect, useState } from 'react';

import { cleanCallingTime } from '../Utils/Cleaners';

function ScoreBoard({ credentials }: { credentials: Credentials }) {
	const [ScoreBoard, setScoreBoard] = useState<Array<JSX.Element> | undefined>(undefined);

	async function getScore(): Promise<ScoreBoard | undefined> {
		try {
			return (
				(
					await axios.post(credentials.URL + '/otherCaller/scoreBoard', {
						area: credentials.area,
						phone: credentials.phone,
						pinCode: credentials.pinCode
					})
				).data.data ?? undefined
			);
		} catch (err: any) {
			console.error(err);
			return undefined;
		}
	}

	useEffect(() => {
		getScore().then(res => {
			if (res) {
				const elements = new Array();
				res?.scoreBoard.forEach((val, i) => {
					elements.push(
						<div className={'ScoreBox' + (i == res.yourPlace || i == 5 ? ' YourSelf' : '')} key={i}>
							<b>
								<span className="Phone">{i == 5 ? res.yourPlace : i + 1}</span>
							</b>
							<span>{val.name}</span>
							<span>
								<span className="Phone">{val.totalCalls}</span>{' '}
								{val.totalCalls > 1 ? 'appels' : 'appel'}
							</span>
							<span className="Phone">{cleanCallingTime(val.totalTime)}</span>
						</div>
					);
				});
				setScoreBoard(elements);
			}
		});
	}, []);

	return (
		<div className="Dashboard">
			<h1>ScoreBoard</h1>
			<div className="ScoreBoard">{ScoreBoard ?? 'Récupération...'}</div>
		</div>
	);
}

export default ScoreBoard;
