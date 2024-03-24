import axios from 'axios';
import { useEffect, useState } from 'react';
import { cleanCallingTime } from '../Utils';

function ScoreBoard({ credentials }: { credentials: Credentials }) {
	const [ScoreBoard, setScoreBoard] = useState<Array<JSX.Element> | undefined>(undefined);

	function getScore() {
		return new Promise<ScoreBoard | undefined>(resolve => {
			axios
				.post(credentials.URL + '/otherCaller/scoreBoard', {
					area: credentials.area,
					phone: credentials.phone,
					pinCode: credentials.pinCode
				})
				.then(res => {
					if (res.data.data) {
						resolve(res.data.data);
					} else {
						resolve(undefined);
					}
				})
				.catch(err => {
					console.error(err);
					resolve(undefined);
				});
		});
	}

	useEffect(() => {
		getScore().then(res => {
			if (res) {
				const elements = new Array();
				res?.scoreBoard.forEach((val, i) => {
					elements.push(
						<div className={'ScoreBox' + (i + 1 == res.yourPlace ? ' YourSelf' : '')} key={i}>
							<b>
								<span className="Phone">{i + 1}</span>
							</b>
							<span>{val.name}</span>
							<span>
								<span className="Phone">{val.nbCall}</span> {val.nbCall > 1 ? 'appels' : 'appel'}
							</span>
							<span className="Phone">{cleanCallingTime(val.timeInCall)}</span>
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
			<div className="ScoreBoard">{ScoreBoard}</div>
		</div>
	);
}

export default ScoreBoard;
