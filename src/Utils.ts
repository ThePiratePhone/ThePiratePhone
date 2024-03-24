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

function isInHours(campaign: Campaign) {
	if (!campaign.callHoursStart || !campaign.callHoursEnd) return;

	const callHoursStart = new Date();
	callHoursStart.setHours(campaign.callHoursStart.getHours());
	callHoursStart.setMinutes(campaign.callHoursStart.getMinutes());

	const callHoursEnd = new Date();
	callHoursEnd.setHours(campaign.callHoursEnd.getHours());
	callHoursEnd.setMinutes(campaign.callHoursEnd.getMinutes());

	return new Date() > callHoursStart && new Date() < callHoursEnd;
}

function parseCampaign(campaign: any) {
	const campaigns = campaign.areaCombo.campaignAvailable
		.sort((a: Campaign, b: Campaign) => {
			if (a.areaName > b.areaName) {
				return 1;
			} else if (a.areaName < b.areaName) {
				return -1;
			}
			return 0;
		})
		.map((old: any) => {
			old.callHoursEnd = new Date(old.callHoursEnd);
			old.callHoursStart = new Date(old.callHoursStart);

			return old;
		});

	return campaigns;
}

function mobileCheck() {
	const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

	return toMatch.some(toMatchItem => {
		return navigator.userAgent.match(toMatchItem);
	});
}

function cleanCallingTime(duration: number) {
	const date = new Date(
		1970,
		0,
		1,
		Math.floor(duration / (1000 * 3600)),
		Math.floor(duration / (1000 * 60)),
		Math.floor(duration / 1000)
	);

	return date.toLocaleTimeString();
}

export { cleanCallingTime, cleanNumber, isInHours, mobileCheck, parseCampaign };
