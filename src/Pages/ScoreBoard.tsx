import axios from 'axios';
import { useEffect, useState } from 'react';

import Loader from '../Components/Loader';
import { cleanCallingTime } from '../Utils/Cleaners';

function ScoreElement({
	you,
	pos,
	name,
	count,
	duration
}: {
	you: boolean;
	pos: number;
	name: string;
	count: number;
	duration: number;
}) {
	return (
		<div className={'ScoreBox' + (you ? ' YourSelf' : '')}>
			<span className="Phone">{pos}</span>
			<b>
				<span>{name}</span>
			</b>
			<span>
				<span className="Phone">{count}</span> {count > 1 ? 'appels' : 'appel'}
			</span>
			<span className="Phone">{cleanCallingTime(duration)}</span>
		</div>
	);
}

function ScoreBoard({ credentials }: { credentials: Credentials }) {
	const [ScoreBoard, setScoreBoard] = useState<Array<JSX.Element> | undefined>(undefined);
	const [Loading, setLoading] = useState(true);
	const [ErrorMessage, setErrorMessage] = useState<string | null>(null);

	async function getScore(): Promise<ScoreBoard | undefined> {
		try {
			return (
				(
					await axios.post(credentials.URL + '/otherCaller/scoreBoard', {
						area: credentials.area,
						phone: credentials.phone,
						pinCode: credentials.pinCode
					})
				).data ?? undefined
			);
		} catch (err: any) {
			console.error(err);
			return undefined;
		}
	}

	useEffect(() => {
		getScore().then(res => {
			setLoading(false);
			if (res) {
				const elements = new Array();
				res?.topfiveUsers.forEach((val, i) => {
					elements.push(
						<ScoreElement
							you={val.you || i == 5}
							count={val.count}
							name={val.name}
							duration={val.totalDuration}
							pos={i == 5 ? res.yourPlace : i + 1}
							key={i}
						/>
					);
				});
				setScoreBoard(elements);
			} else {
				setErrorMessage('Impossible de récupérer le tableau des scores.');
			}
		});
	}, []);

	return (
		<div className="Dashboard">
			<h1>ScoreBoard</h1>
			<div className="ScoreBoard">{ScoreBoard}</div>
			{ErrorMessage ?? ''}
			{Loading ? <Loader /> : <></>}
		</div>
	);
}

export default ScoreBoard;
