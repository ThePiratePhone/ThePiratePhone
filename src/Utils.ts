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

function isInHours(campaign: Campaign) {
	if (!campaign.callHoursStart || !campaign.callHoursEnd) return true;

	const callHoursStart = new Date();
	callHoursStart.setHours(campaign.callHoursStart.getHours());
	callHoursStart.setMinutes(campaign.callHoursStart.getMinutes());

	const callHoursEnd = new Date();
	callHoursEnd.setHours(campaign.callHoursEnd.getHours());
	callHoursEnd.setMinutes(campaign.callHoursEnd.getMinutes());

	return new Date() > callHoursStart && new Date() < callHoursEnd;
}

function parseCampaign(campaign: any) {
	const campaigns = campaign.areaCombo.campaignAvailable.sort(campaignSorting).map((old: any) => {
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
		Math.floor((duration / (1000 * 3600)) % 24),
		Math.floor((duration / (1000 * 60)) % 60),
		Math.floor((duration / 1000) % 60)
	);

	return date.toLocaleTimeString();
}

function randomBetween(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function areaSorting(a: Area, b: Area) {
	if (a.name > b.name) {
		return 1;
	} else if (a.name < b.name) {
		return -1;
	}
	return 0;
}

function campaignSorting(a: Campaign, b: Campaign) {
	if (a.areaName > b.areaName) {
		return 1;
	} else if (a.areaName < b.areaName) {
		return -1;
	}
	return 0;
}

export {
	areaSorting,
	campaignSorting,
	cleanCallingTime,
	cleanNumber,
	cleanSatisfaction,
	cleanStatus,
	isInHours,
	mobileCheck,
	parseCampaign,
	randomBetween
};
