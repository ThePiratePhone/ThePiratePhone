import { campaignSorter } from './Sorters';

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

function parseCampaign(campaigns: Array<Campaign>) {
	return campaigns.sort(campaignSorter).map(old => {
		if (old.callHoursEnd) old.callHoursEnd = new Date(old.callHoursEnd);
		if (old.callHoursStart) old.callHoursStart = new Date(old.callHoursStart);

		return old;
	});
}

function mobileCheck() {
	return [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i].some(flag => {
		return navigator.userAgent.match(flag);
	});
}

function getRandom(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { getRandom, isInHours, mobileCheck, parseCampaign };
