function cleanNumber(number: string) {
	if (number == undefined) return undefined;
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

export { cleanCallingTime, cleanNumber };
