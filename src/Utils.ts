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

	if (number.startsWith('+33')) {
		number.split('');
	}

	return newNumber;
}

export { cleanNumber };
