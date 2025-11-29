import { useState, useEffect } from 'react';

function Timer({ deadline }: { deadline: Date }) {
	if (typeof deadline == 'string') {
		deadline = new Date(deadline);
	}

	const [days, setDays] = useState(0);
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);

	const getTime = () => {
		const time = deadline.getTime() - Date.now();

		setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
		setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
		setMinutes(Math.floor((time / 1000 / 60) % 60));
		setSeconds(Math.floor((time / 1000) % 60));
	};

	useEffect(() => {
		const interval = setInterval(getTime, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="TimerComponent">
			<p>temps restant:</p>
			<div className="timer" role="timer">
				{days > 0 ? (
					<div className="box">
						<p id="day">{days < 10 ? '0' + days : days}j</p>
					</div>
				) : (
					<></>
				)}
				{hours > 0 || days > 0 ? (
					<div className="box">
						<p id="hour">{hours < 10 ? '0' + hours : hours}h</p>
					</div>
				) : (
					<></>
				)}
				{minutes > 0 || hours > 0 || days > 0 ? (
					<div className="box">
						<p id="hour">{minutes < 10 ? '0' + minutes : minutes}min</p>
					</div>
				) : (
					<></>
				)}
				{seconds > 0 || minutes > 0 || hours > 0 || days > 0 ? (
					<div className="box">
						<p id="hour">{seconds < 10 ? '0' + seconds : seconds}s</p>
					</div>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}

export default Timer;
