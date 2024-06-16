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

function parseCampaign(campaign: { areaCombo: { campaignAvailable: Array<Campaign> } }) {
	const campaigns = campaign.areaCombo.campaignAvailable.sort(campaignSorter).map((old: any) => {
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

function getRandom(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { getRandom, isInHours, mobileCheck, parseCampaign };
