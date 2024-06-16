function cleanNumber(number: string) {
	const numberArray = number.split('');
	let newNumber = '';
	if (number.length % 2) {
		newNumber += numberArray.splice(0, 4).join('');
	} else {
		newNumber += numberArray.splice(0, 3).join('');
	}
	newNumber += ' ' + numberArray.splice(0, 1);
	for (let i = 0; i < numberArray.length; i = i + 2) {
		newNumber += ' ' + numberArray[i] + numberArray[i + 1];
	}

	if (newNumber.startsWith('+33 ')) {
		newNumber = newNumber.replace('+33 ', '0');
	}

	return newNumber;
}

function cleanStatus(status: CallStatus) {
	switch (status) {
		case 'Called':
			return 'Appelé·e';
		case 'Not responded':
			return 'Pas de réponse';
		case 'Calling':
			return 'En cours';
		default:
			return 'Pas appelé·e';
	}
}

function cleanSatisfaction(satisfaction: Satisfaction) {
	switch (satisfaction) {
		case -2:
			return 'À retirer';
		case -1:
			return 'Pas interessé·e';
		case 0:
			return 'Pas de réponse';
		case 1:
			return 'Ne compte pas voter';
		case 2:
			return 'Compte voter';
		default:
			return 'Appel en cours';
	}
}

function cleanCallingTime(duration: number) {
	const date = new Date(
		1970,
		0,
		1,
		Math.floor((duration / (1000 * 3600)) % 24),
		Math.floor((duration / (1000 * 60)) % 60),
		Math.floor((duration / 1000) % 60)
	);

	return date.toLocaleTimeString();
}

export { cleanCallingTime, cleanNumber, cleanSatisfaction, cleanStatus };
