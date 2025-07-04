import { campaignSorter } from './Sorters';

function isInHours(campaign: Campaign) {
	const now = new Date();

	if (!campaign.callHoursStart || !campaign.callHoursEnd) return true;

	const callHoursStart = new Date();
	callHoursStart.setHours(
		new Date(campaign.callHoursStart).getHours(),
		new Date(campaign.callHoursStart).getMinutes(),
		0,
		0
	);

	const callHoursEnd = new Date();
	callHoursEnd.setHours(
		new Date(campaign.callHoursEnd).getHours(),
		new Date(campaign.callHoursEnd).getMinutes(),
		0,
		0
	);

	return now > callHoursStart && now < callHoursEnd;
}

function parseCampaign(campaigns: Array<Campaign>) {
	return campaigns.sort(campaignSorter).map(campaign => ({
		...campaign,
		callHoursEnd: campaign.callHoursEnd ? new Date(campaign.callHoursEnd) : campaign.callHoursEnd,
		callHoursStart: campaign.callHoursStart ? new Date(campaign.callHoursStart) : campaign.callHoursStart
	}));
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
